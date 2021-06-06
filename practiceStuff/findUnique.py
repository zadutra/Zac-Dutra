#!/usr/bin/env python3
# Name: Avani Narayan
# Group Members: None

import sys
class FastAreader :
    
    def __init__ (self, fname=''):
        '''contructor: saves attribute fname '''
        self.fname = fname
            
    def doOpen (self):
        if self.fname == '':
            return sys.stdin
        else:
            return open(self.fname)
        
    def readFasta (self):
        
        header = ''
        sequence = ''
        
        with self.doOpen() as fileH:
            
            header = ''
            sequence = ''
            
            # skip to first fasta header
            line = fileH.readline()
            while not line.startswith('>') :
                if not line: # we are at EOF
                    return header, sequence
                line = fileH.readline()
            header = line[1:].rstrip()

            for line in fileH:
                if line.startswith ('>'):
                    yield header,sequence
                    header = line[1:].rstrip()
                    sequence = ''
                else :
                    sequence += ''.join(line.rstrip().split()).upper()

        yield header,sequence


class tRNA:
    '''
    This is my tRNA class and it has the following methods:
    __init__
    powerset
    uniques
    essentials

    All of these methods are used to get the essential substrings in a given subsequence
    '''

    def __init__(self, head, seq):
        '''
        __init__

        This methos creates a new tRNA object
        inputs: head, from FastAreader
                seq, from FastAreader

        Created fields:
        tSet: Original set of every possible substring in the given sequence
        uniqueSet: Used to store all the substrings unique to this sequence
        essentialSet: Used to store all the substrings that are essential to the sequence
        output: Used to store the essential substrings in the correct format to be printed out 
        '''
        self.head = head
        self.seq = seq
        self.tSet = set()
        self.uniqueSet = set()
        self.essentialSet = set()
        self.output = []

    def powerset(self):
        '''
        powerset

        This function stores every possible substring of self.seq in self.tSet
        '''
        for x in range(0, len(self.seq)):
            for y in range(x + 1, len(self.seq) + 1):
                self.tSet.add(self.seq[x:y])

    def uniques(self, union):
        '''
        uniques

        input: union, the union of every other tRNA tSet except the one we are comparing
        This function stores every substring not in the union in self.uniqueSet
        '''
        for x in self.tSet:
            if x not in union:
                self.uniqueSet.add(x)

    def essentials(self):
        '''
        essentials

        This function goes through every unique string in self.uniqueSet and checks if it is a substring in all of
        the other members of the set. If it is a substring in a member if the set, we remove it from the essential set
        '''
        self.essentialSet = self.uniqueSet.copy()
        temp = self.uniqueSet.copy()
        for x in self.uniqueSet:
            temp.remove(x)
            for y in temp:
                if x in y:
                    if y in self.essentialSet:
                        self.essentialSet.remove(y)
            temp.add(x)


########################################################################
# Main
# Here is the main program
# 
########################################################################

def main(inCL=None):
    sys.stdout.reconfigure(encoding='utf-8') #to help with special characters
    myReader = FastAreader()
    myObjects = [] #used to store all the tRNA objects
    U_set = set() # used to store the union of all sets
    outstring = ''
    for head, seq in myReader.readFasta(): #get the head and seq from FastAReader and make new tRNA objects
        head = ''.join(head.split())
        seq = seq.replace("-", "").replace("_", "").replace(".", "") #remove the formatting characters
        newRNA = tRNA(head, seq)
        newRNA.powerset()
        myObjects.append(newRNA)
    myObjects.sort( key = lambda x: (x.head)) #sort tRNA objcts alphabetically by the header
    for x in myObjects:
        temp = myObjects.copy() #make a copy of the object list
        temp.remove(x) #remove the object we want to compare against the union
        for y in temp:
            U_set.update(y.tSet) #add everything to the union
        x.uniques(U_set)
        U_set.clear() #clear the union set
        x.essentials()
        print(x.head)
        print(x.seq)
        for y in x.essentialSet:
            index = x.seq.find(y)
            while index != -1:
                outstring += ('.' * index)
                outstring += y
                x.output.append(outstring)
                outstring = ''
                index = x.seq.find(y, index+1)
        x.output.sort(key=len)
        for q in x.output:
           print(q)


if __name__ == "__main__":
    main()  