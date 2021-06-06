#!/usr/bin/env python3
# Name: Avani Narayan
# Group Members: None
########################################################################
# For my design, I used the psuedocode provided from Siddish
# I will say after going to multiple tutoring sessions, I could never get
#   the ouput for ;ab5test.fa to be exactly right. However, my output for
#   tass2.fa works as it should.
########################################################################

from sequenceAnalysis import FastAreader, NucParams
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
        self.parser.add_argument('-lG', '--longestGene', action = 'store', nargs='?', const=True, default=False, help='longest Gene in an ORF')
        self.parser.add_argument('-mG', '--minGene', type=int, choices= (0,100,200,300,500,1000), default=100, action = 'store', help='minimum Gene length')
        self.parser.add_argument('-s', '--start', action = 'store', default = ['ATG'],nargs='?', help='start Codon') #allows multiple list options
        self.parser.add_argument('-t', '--stop', action = 'store', default = ['TAG','TGA','TAA'],nargs='?', help='stop Codon') #allows multiple list options
        self.parser.add_argument('-v', '--version', action='version', version='%(prog)s 0.1')  
        if inOpts is None :
            self.args = self.parser.parse_args()
        else :
            self.args = self.parser.parse_args(inOpts)
'''
findORf:
    inputs:
        seq: sequence inputted used to find ORF's
        starts: what codons to be considered at start codons
        stops: what codons to be considered as stop codons
        longGene: Wether or not we want to consider ORF's inside of ORF's
    
    output:
        A sorted list of lists. These lists contain the frame, start, stop and length
        of each valid ORF.
'''
def findORF(seq, starts, stops, longGene):
    returnList = []
    startList = []
    myString = ''
    mySeq = ''
    for x in range(3): # x is the current frame we are in
        startList.append(0) #append 0 to the startList, unless the first codon in the frame is a start codon
        if seq[x:x+3] in starts:
            startList.clear()
        for i in range(x, len(seq), 3): # for each codon in the current frame
            myString = seq[i:i+3]
            if myString in starts: # append to start list
                startList.append(i)
            elif myString in stops: # create the list element
                if startList == []:
                    continue
                if longGene == False: #stores all ORFS
                    for j in startList:
                        start = j + 1
                        stop = i + 3
                        temp = [(x+1), start, stop,  stop - start + 1]
                        returnList.append(temp)
                    startList.clear()
                else: #Stores only the first ORF
                    start = startList[0] + 1
                    stop = i + 3
                    temp = [(x+1), start, stop,  stop - start + 1]
                    returnList.append(temp)
                    startList.clear()
        if startList != []: #If there is start codons but no stop, setstop as the end of the sequence
            if longGene == False:
                for j in startList:
                    start = j + 1
                    stop = len(seq)
                    temp = [(x+1), start, stop,  stop - start + 1]
                    returnList.append(temp)
                startList.clear()
            else:
                start = startList[0] + 1
                stop = len(seq)
                temp = [(x+1), start, stop,  stop - start + 1]
                returnList.append(temp)
                startList.clear()
    complement = {'A': 'T', 'C': 'G', 'G': 'C', 'T': 'A'} #setting the reverse compliment
    mySeq = ''.join([complement[base] for base in seq[::-1]]) # I got this code from stack Overflow
    '''
    This is the same process as before, only the start and stop positions
    are calculated differently to get their position in the original sequence
    '''
    for x in range(3):
        startList.append(0)
        if mySeq[x:x+3] in starts:
            startList.clear()
        for i in range(x, len(mySeq), 3):
            myString = mySeq[i:i+3]
            if myString in starts:
                startList.append(i)
            elif myString in stops:
                if startList == []:
                    continue
                if longGene == False:
                    for j in startList:
                        start = len(mySeq) - j + 1
                        stop =  len(mySeq) - j + 1
                        temp = [(x+1)*-1, start, stop,  stop - start + 1]
                        returnList.append(temp)
                    startList.clear()
                else:
                    start = len(mySeq) - (i + 3) + 1
                    stop =  len(mySeq) - startList[0]
                    temp = [(x+1)*-1, start, stop,  stop - start + 1]
                    returnList.append(temp)
                    startList.clear()
        if startList != []:
            if longGene == False:
                for j in startList:
                    start = j + 1
                    stop = len(seq)
                    temp = [(x+1)*-1, start, stop, stop - start + 1]
                    returnList.append(temp)
                startList.clear()
            else:
                start = startList[0] + 1
                stop = len(seq)
                temp = [(x+1)*-1, start, stop, stop - start + 1]
                returnList.append(temp)
                startList.clear()
    returnList.sort(reverse = True, key = lambda x: (x[3], -x[1])) #this lambda function sorts the list by length, and then start position
    return returnList
            
########################################################################
# Main
# Here is the main program
# I implimented the use of the command line
# If you want to add multiple start/stop codons, please write it like this
#               '-s=['ATG', 'GTG', 'TTG]'
########################################################################
   
def main(inFile = None, options = None):
    '''
    Find some genes.  
    '''
    thisCommandLine = CommandLine(options)
    myReader = FastAreader()
    longGene = thisCommandLine.args.longestGene
    minGene = thisCommandLine.args.minGene
    starts = thisCommandLine.args.start
    stops = thisCommandLine.args.stop
    for head, seq in myReader.readFasta() :
        print(head)
        resultList = findORF(seq, starts, stops, longGene)
        for element in resultList:
            if element[3] >= minGene:
                print('{:+d} {:>5d}..{:>5d} {:>5d}'.format(element[0], element[1], element[2], element[3]))
       

if __name__ == "__main__":
    main()