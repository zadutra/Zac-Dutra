#!/usr/bin/env python3
# Name: Avani Narayan
# Group Members: Aadhithya

import sys

########################################################################
# CommandLine
########################################################################
class CommandLine() :
    '''
    Handle the command line, usage and help requests.
    CommandLine uses argparse, now standard in 2.7 and beyond. 
    it implements a standard command line argument parser with various argument options,
    a standard usage and help.
    attributes:
    all arguments received from the commandline using .add_argument will be
    avalable within the .args attribute of object instantiated from CommandLine.
    For example, if myCommandLine is an object of the class, and requiredbool was
    set as an option using add_argument, then myCommandLine.args.requiredbool will
    name that option.
 
    '''
    
    def __init__(self, inOpts=None) :
        '''
        Implement a parser to interpret the command line argv string using argparse.
        '''
        
        import argparse
        self.parser = argparse.ArgumentParser(description = 'Program prolog - a brief description of what this thing does', 
                                             epilog = 'Program epilog - some other stuff you feel compelled to say', 
                                             add_help = True, #default is True 
                                             prefix_chars = '-', 
                                             usage = '%(prog)s [options] -option1[default] <input >output'
                                             )
        self.parser.add_argument('-P33in', action = 'store', nargs='?', const=True, default=False)
        self.parser.add_argument('-P64in', action = 'store', nargs='?', const=True, default=False)
        self.parser.add_argument('-P64Bin', action = 'store', nargs='?', const=True, default=False)
        self.parser.add_argument('-P64SOLin', action = 'store', nargs='?', const=True, default=False)
        self.parser.add_argument('-P33out', action = 'store', nargs='?', const=True, default=True)
        self.parser.add_argument('-P64out', action = 'store', nargs='?', const=True, default=False)
        if inOpts is None :
            self.args = self.parser.parse_args()
        else :
            self.args = self.parser.parse_args(inOpts)



class FastQreader :
    ''' 
    Define objects to read FastQ files.
    
    instantiation: 
    thisReader = FastQreader ('testTiny.fa')
    usage:
    for head, seq in thisReader.readFastq():
        print (head,seq, qual)
    '''
    def __init__ (self, fname=''):
        '''contructor: saves attribute fname '''
        self.fname = fname
            
    def doOpen (self):
        ''' Handle file opens, allowing STDIN.'''
        if self.fname == '':
            return sys.stdin
        else:
            return open(self.fname)
        
    def readFastq (self):
        ''' Read an entire FastQ record and return the sequence header/sequence/quality'''
        header = ''
        sequence = ''
        quality = ''
        
        with self.doOpen() as fileH:
            
            header = ''
            sequence = ''
            quality = ''
            line = 'temp'
            while line != '':
                line = fileH.readline()
                if line.startswith ('@'):
                    header = line[1:].rstrip()
                    line = fileH.readline()
                    sequence = ''.join(line.rstrip().split()).upper()
                    line = fileH.readline()
                    line = fileH.readline()
                    quality = ''.join(line.rstrip().split())
                if line != '':
                    yield header,sequence,quality

#Dictionary used for SOLEXA conversions          
SOLEXA_dict = {9:10, 8:9, 7:8, 6:7, 5:6, 4:5, 3:5, 2:4, 1:4, 0:3, -1:3, -2:2, -3:2, -4:1, -5:1}


def P33_to_P64(qual):
    '''
        This function is used to convert P33
        values to P64 values
    '''
    output = ""
    for char in qual:
        val = ord(char)-33
        val += 64
        output += chr(val)
    return output

def P64_to_P33(qual):
    '''
        This function is used to convert P64
        values to P33 values
    '''
    output = ""
    for char in qual:
        val = ord(char)-64
        val += 33
        output += chr(val)
    return output

def P64B_to_P33(qual):
    '''
        This function is used to convert P64B
        values to P33 values
    '''
    output = ""
    for char in qual:
        val = ord(char)-64
        if val == 2: #B exception
            val = 0
        val += 33
        output += chr(val)
    return output

def P64B_to_P64(qual):
    '''
        This function is used to convert P64B
        values to P64 values
    '''
    output = ""
    for char in qual:
        val = ord(char)-64
        if val == 2: #B exception
            val = 0
        val += 64
        output += chr(val)
    return output

def P64SOL_to_P33(qual):
    '''
        This function is used to convert P64SOL
        values to P33 values
    '''
    output = ""
    for char in qual:
        val = ord(char)-64
        if val >= 10: #If val < 10, use SOLEXA_dict mapping
            val += 33
            output += chr(val)
        else:
            val = SOLEXA_dict.get(val)
            val += 33
            output += chr(val)
    return output

def P64SOL_to_P64(qual):
    '''
        This function is used to convert P64SOL
        values to P64 values
    '''
    output = ""
    for char in qual:
        val = ord(char)-64
        if val >= 10: #If val < 10, use SOLEXA mapping
            val += 64
            output += chr(val)
        else:
            val = SOLEXA_dict.get(val)
            val += 64
            output += chr(val)
    return output

########################################################################
# Main
# Here is the main program
# I implimented the use of the command line
# If you want to add multiple start/stop codons, please write it like this
#               '-s=['ATG', 'GTG', 'TTG]'
########################################################################
   
def main(inFile = None, options = None):
    thisCommandLine = CommandLine(options)
    myReader = FastQreader()
    input = ""
    output = ""

    #See which values are true from Command line
    P33_in = thisCommandLine.args.P33in
    P64_in = thisCommandLine.args.P64in
    P64B_in = thisCommandLine.args.P64Bin
    P64_out = thisCommandLine.args.P64out

    if P33_in is True:
        input = "P33"
        P64_in = False
        P64B_in = False
    elif P64_in is True:
        input = "P64"
        P64B_in = False
    elif P64B_in is True:
        input = "P64B"
    else:
        input = "P64SOL"

    #Determine the output from the commandline
    if P64_out is True:
        output = "P64"
    else:
        output = "P33"

    for head, seq, qual in myReader.readFastq():
        #Replace the unknown cases
        seq = seq.replace("*", "N")
        seq = seq.replace(".", "N")
        seq = seq.replace("n", "N")
        #Determine which function to call based on input and output
        if input == "P33":
            if output == "P64":
                qual = P33_to_P64(qual)
                if qual == "ERROR":
                    continue
        elif input == "P64":
            if output == "P33":
                qual = P64_to_P33(qual)
                if qual == "ERROR":
                    continue
        elif input == "P64B":
            if output == "P33":
                qual = P64B_to_P33(qual)
                if qual == "ERROR":
                    continue
            else:
                qual = P64B_to_P64(qual)
                if qual == "ERROR":
                    continue
        else: #input is P64SOL
            if output == "P33":
                qual = P64SOL_to_P33(qual)
                if qual == "ERROR":
                    continue
            else:
                qual = P64SOL_to_P64(qual)
                if qual == "ERROR":
                    continue
        #Print out necessary output
        print("@"+head)
        print(seq)
        print("+"+head)
        print(qual)
        qual = ""
       

if __name__ == "__main__":
    main()