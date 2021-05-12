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
    return list["length"]

def innerORF(seq, starts, stops, position, frame):
    returnList = []
    tempObject = {}
    count = 0
    globalCount = 0
    tracker = 0
    mySeq = ''
    myString = ''
    startCheck = False
    stopCheck = False
    for x in range(3):
        if x == 0:
            mySeq = seq
        if x == 1:
            mySeq = seq[1:]
        if x == 2:
            mySeq = seq[2:]
        for letter in mySeq:
            myString += letter
            globalCount += 1
            count += 1
            if count == 3:
                if myString in starts:
                    if tempObject != {}:
                        funcSeq = mySeq[globalCount-2:]
                        returnList = returnList + innerORF(funcSeq, starts, stops, globalCount, x+1)
                    tempObject["start_pos"] = globalCount - 2 + position
                if myString in stops:
                    tempObject["stop_pos"] = globalCount + position
                    if "start_pos" not in tempObject:
                        tempObject["start_pos"] = tracker
                    tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"]
                    tempObject["frame"] = frame
                    tracker = globalCount + 1
                    returnList.append(tempObject.copy())
                    break
                count = 0
                myString = ''
        if not tempObject:
            break
        if (tempObject["start_pos"]) and (not tempObject["stop_pos"]):
            tempObject["stop_pos"] = len(mySeq)
            tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"]
            tempObject["frame"] = frame
            returnList.append(tempObject.copy())
        globalCount = 0
        tracker = 0
        tempObject.clear()
    globalCount = 0
    tracker = 0
    if not startCheck and not stopCheck:
        tempObject["start_pos"] = position - 1
        tempObject["stop_pos"] = len(mySeq)
        tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"]
        tempObject["frame"] = frame
    returnList.sort(reverse = True, key=sortFunc)
    return returnList

def innerORF_negative(seq, starts, stops, position, frame):
    returnList = []
    tempObject = {}
    count = 0
    globalCount = 0
    tracker = 0
    mySeq = ''
    myString = ''
    startCheck = False
    stopCheck = False
    for x in range(3):
        if x == 0:
            mySeq = seq
        if x == 1:
            mySeq = seq[1:]
        if x == 2:
            mySeq = seq[2:]
        for letter in mySeq:
            myString += letter
            globalCount += 1
            count += 1
            if count == 3:
                if myString in starts:
                    if tempObject != {}:
                        funcSeq = mySeq[globalCount-2:]
                        returnList = returnList + innerORF(funcSeq, starts, stops, globalCount, (x+1) * -1)
                    tempObject["start_pos"] = globalCount - 2 + position
                if myString in stops:
                    tempObject["stop_pos"] = globalCount + position
                    if "start_pos" not in tempObject:
                        tempObject["start_pos"] = tracker
                    tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"]
                    tempObject["frame"] = frame
                    tracker = globalCount + 1
                    returnList.append(tempObject.copy())
                    break
                count = 0
                myString = ''
        if not tempObject:
            break
        if (tempObject["start_pos"]) and (not tempObject["stop_pos"]):
            tempObject["stop_pos"] = len(mySeq)
            tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"]
            tempObject["frame"] = frame
            returnList.append(tempObject.copy())
        globalCount = 0
        tracker = 0
        tempObject.clear()
    globalCount = 0
    tracker = 0
    if not tempObject: #no start or stops were found
            tempObject["start_pos"] = 1
            tempObject["stop_pos"] = len(mySeq) + (frame * -1)
            tempObject["length"] = len(mySeq) + (frame * -1)
            tempObject["frame"] = frame
            returnList.append(tempObject.copy())
    if not startCheck and not stopCheck:
        tempObject["start_pos"] = position - 1
        tempObject["stop_pos"] = len(mySeq)
        tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"]
        tempObject["frame"] = frame
    returnList.sort(reverse = True, key=sortFunc)
    return returnList

def findORF(seq, starts, stops, longGene, minGene):
    returnList = []
    tempObject = {}
    tempObject2 = {}
    count = 0
    globalCount = 0
    tracker = 1
    mySeq = ''
    myString = ''
    startCheck = False
    stopCheck = False
    for x in range(3):
        if x == 0:
            mySeq = seq
        if x == 1:
            mySeq = seq[1:]
        if x == 2:
            mySeq = seq[2:]
        for letter in mySeq:
            myString += letter
            globalCount += 1
            count += 1
            if count == 3:
                if myString in starts:
                    startCheck = True
                    if (tempObject != {}) and (longGene == False):
                        funcSeq = mySeq[globalCount-3:]
                        if innerORF(funcSeq, starts, stops, globalCount-2, x+1) is not None:
                            returnList = returnList + innerORF(funcSeq, starts, stops, globalCount - 2, x+1)
                    elif tempObject == {}:
                        tempObject["start_pos"] = globalCount - 2 + x
                    else:
                        continue
                if myString in stops:
                    stopCheck = True
                    tempObject["stop_pos"] = globalCount + x
                    if "start_pos" not in tempObject:
                        print("in condition")
                        print(tempObject)
                        tempObject["start_pos"] = tracker
                    tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"] + 1
                    tempObject["frame"] = x + 1
                    tracker = globalCount + 1
                    returnList.append(tempObject.copy())
                count = 0
                myString = ''
        count = 0
        myString = ''
        if not tempObject: #no start or stops were found
            tempObject["start_pos"] = 1
            tempObject["stop_pos"] = len(mySeq) + x
            tempObject["length"] = len(mySeq) + x
            tempObject["frame"] = x + 1
            print(tempObject)
            returnList.append(tempObject.copy())
        elif (tempObject["start_pos"]) and ("stop_pos" not in tempObject): #stop codon with no start
            tempObject["stop_pos"] = len(mySeq)
            tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"] + 1
            tempObject["frame"] = x + 1
            returnList.append(tempObject.copy())
        globalCount = 0
        tracker = 1
        count = 0
        tempObject.clear()
        tempObject2.clear()
    complement = {'A': 'T', 'C': 'G', 'G': 'C', 'T': 'A'}
    mySeq = ''.join([complement[base] for base in seq[::-1]]) #I got this code from stack overflow
    count = 0
    for x in range(3):
        if x == 0:
            mySeq = mySeq
        if x == 1:
            mySeq = mySeq[1:]
        if x == 2:
            mySeq = mySeq[1:]
        for letter in mySeq:
            myString += letter
            globalCount += 1
            count += 1
            if count == 3:
                if myString in starts:
                    startCheck = True
                    if (tempObject != {}) and (longGene == False):
                        funcSeq = mySeq[globalCount-3:]
                        if innerORF_negative(funcSeq, starts, stops, globalCount-2, (x+1)*-1) is not None:
                            returnList = returnList + innerORF_negative(funcSeq, starts, stops, globalCount - 2, (x+1)*-1)
                    else:
                        tempObject["start_pos"] = globalCount - 2 - x
                if myString in stops:
                    stopCheck = True
                    tempObject["stop_pos"] = globalCount
                    if "start_pos" not in tempObject:
                        tempObject["start_pos"] = tracker
                    tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"]
                    tempObject["frame"] = (x + 1) * -1
                    tracker = globalCount
                    returnList.append(tempObject.copy())
                    tempObject.clear()
                count = 0
                myString = ''
        count = 0
        myString = ''
        globalCount = 0
        tracker = 1
        if not tempObject: #no start or stops were found
            tempObject["start_pos"] = 1
            tempObject["stop_pos"] = len(mySeq) + x
            tempObject["length"] = len(mySeq) + x
            tempObject["frame"] = (x + 1) * -1
            returnList.append(tempObject.copy())
            tempObject.clear()
        elif (tempObject["start_pos"]) and ("stop_pos" not in tempObject): #stop codon with no start
            tempObject["stop_pos"] = len(mySeq)
            tempObject["length"] = tempObject["stop_pos"] - tempObject["start_pos"]
            tempObject["frame"] = (x + 1) * -1
            returnList.append(tempObject.copy())
            tempObject.clear()
    #print(returnList)
    for item in list(returnList):
        if item["length"] < minGene:
            returnList.remove(item)
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
            print('{:+d} {:>5d}..{:>5d} {:>5d}'.format(element["frame"], element["start_pos"], element["stop_pos"], element["length"]))
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