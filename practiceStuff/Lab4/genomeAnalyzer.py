#!/usr/bin/env python3
# Name: Avani Narayan
# Group Members: None

import sys
from sequenceAnalysis import NucParams

class FastAreader :
    ''' 
    Define objects to read FastA files.
    
    instantiation: 
    thisReader = FastAreader ('testTiny.fa')
    usage:
    for head, seq in thisReader.readFasta():
        print (head,seq)
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
        
    def readFasta (self):
        ''' Read an entire FastA record and return the sequence header/sequence'''
        header = ''
        sequence = ''
        
        with self.doOpen() as fileH:
            
            header = ''
            sequence = ''
            
            # skip to first fasta header
            line = fileH.readline()
            while not line.startswith('>') :
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




def main ():
    '''
    This is the main function of the file. It's purpose is to
    print out the reuired output for Lab4.
    '''
    myReader = FastAreader()
    myNuc = NucParams()
    for head, seq in myReader.readFasta() :
        myNuc.addSequence(seq)
        
    # sort codons and AA's in alpha order
    newAADict = dict(sorted(myNuc.aaComposition().items()))
    newCodonDict = dict(sorted(myNuc.codonComposition().items()))
    
    #Calculate sequence length in Mb and print it out
    num = myNuc.nucCount()
    num = num / 1000000
    print('sequence length = {:.2f} Mb\n'.format(num))

    #Calculate GC value and print it out
    GC = myNuc.nucComposition()['G'] + myNuc.nucComposition()['C']
    GC = GC / myNuc.nucCount()
    print('GC content = {:.1f}%\n'.format(GC*100))

    # calculate relative codon usage for each codon and print
    for aa in newAADict:
        for codon in newCodonDict:
            if myNuc.rnaCodonTable[codon] == aa:
                val = newCodonDict[codon]/newAADict[aa]
                print ('{:s} : {:s} {:5.1f} ({:6d})'.format(codon, aa, val*100, newCodonDict[codon]))

if __name__ == "__main__":
    main()