#!/usr/bin/env python3
# Name: Avani Narayan
# Group Members: None

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
        self.parser.add_argument('-mG', '--minGene', type=int, choices= (100,200,300,500,1000), default=100, action = 'store', help='minimum Gene length')
        self.parser.add_argument('-s', '--start', action = 'append', default = ['ATG'],nargs='?', 
                                 help='start Codon') #allows multiple list options
        self.parser.add_argument('-t', '--stop', action = 'append', default = ['TAG','TGA','TAA'],nargs='?', help='stop Codon') #allows multiple list options
        self.parser.add_argument('-v', '--version', action='version', version='%(prog)s 0.1')  
        if inOpts is None :
            self.args = self.parser.parse_args()
        else :
            self.args = self.parser.parse_args(inOpts)


def sortFunc(list):
    return list[3]


def findORF(seq, starts, stops, longGene, minGene):
    returnList = []
    startList = []
    stopList = []
    myString = ''
    mySeq = ''
    for x in range(3):
        stopCheck = False
        checkStart = False
        for i in range(x, len(seq), 3):
            myString = seq[i:i+3]
            if myString in starts:
                if i == 0 or i == 2:
                    startList.append(1)
                else:
                    startList.append(i)
            elif myString in stops:
                if startList == []:
                    startList.append(1)
                #print("{0} in stops".format(x+1))
                stopCheck = True
                if longGene == False:
                    for j in startList:
                        temp = [(x+1), j, i + 3,  i + 3 - j + 1]
                        returnList.append(temp)
                    startList.clear()
                else:
                    temp = [(x+1), startList[0], i + 3,  i + 3 - startList[0] + 1]
                    #print("with stop:{0}".format(temp))
                    returnList.append(temp)
                    startList.clear()
        if stopCheck == False:
            if startList == []:
                startList.append(1)
            for j in startList:
                temp = [x+1, j, len(seq), len(seq) - j + 1]
                #print("no stop:{0}".format(temp))
                returnList.append(temp)
            startList.clear()
    complement = {'A': 'T', 'C': 'G', 'G': 'C', 'T': 'A'}
    mySeq = ''.join([complement[base] for base in seq[::-1]])
    print(mySeq)
    for x in range(3):
        stopCheck = False
        for i in range(x, len(mySeq), 3):
            myString = mySeq[i:i+3]
            if myString in starts:
                print((x+1) * -1, i,  myString)
                if i == 0 or i == 2:
                    startList.append(1)
                else:
                    startList.append(i)
            elif myString in stops:
                stopCheck = True
                if startList == [] and (i != 0 or i != 2):
                    print((x+1) * -1, i,  myString)
                    startList.append(1)
                if longGene == False:
                    for j in startList:
                        start = len(mySeq) - j
                        stop =  len(mySeq) - j + 1
                        temp = [(x+1)*-1, start, stop,  stop - start + 1]
                        returnList.append(temp)
                    startList.clear()
                else:
                    print((x+1)*-1, startList)
                    start = len(mySeq) - (startList[0] + 3) + 1
                    stop =  len(mySeq) - startList[0] + 1
                    temp = [(x+1)*-1, start, stop,  stop - start + 1]
                    returnList.append(temp)
                    startList.clear()
        if stopCheck == False:
            if startList == [] and (i != 0 or i != 2):
                startList.append(1)
            for j in startList:
                temp = [(x+1)*-1, j, len(seq), len(seq) - j + 1]
                #print("no stop:{0}".format(temp))
                returnList.append(temp)
            startList.clear()
            '''
    for item in list(returnList):
        if item[3] < minGene:
            returnList.remove(item)
            '''
    returnList.sort(reverse = True, key=sortFunc)
    return returnList
            
########################################################################
# Main
# Here is the main program
# 
#
########################################################################
   
def main(inFile = None, options = None):
    '''
    Find some genes.  
    '''
    mySeq = ''
    thisCommandLine = CommandLine(options)
    myReader = FastAreader()
    longGene = thisCommandLine.args.longestGene
    minGene = thisCommandLine.args.minGene
    starts = thisCommandLine.args.start
    stops = thisCommandLine.args.stop
    for head, seq in myReader.readFasta() :
        print(head)
        resultList = findORF(seq, starts, stops, longGene, minGene)
        for element in resultList:
            print('{:+d} {:>5d}..{:>5d} {:>5d}'.format(element[0], element[1], element[2], element[3]))
        #print(resultList)
    #print (mySeq)
    ###### replace the code between comments.
    # thisCommandLine.args.longestGene is True if only the longest Gene is desired
    # thisCommandLine.args.start is a list of start codons
    # thisCommandLine.args.stop is a list of stop codons
    # thisCommandLine.args.minGene is the minimum Gene length to include
    #
    #######

if __name__ == "__main__":
    main(inFile = sys.argv[0], options = ['-mG=300', '-lG']) # delete this stuff if running from commandline