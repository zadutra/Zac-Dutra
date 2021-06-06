#!/usr/bin/env python3
# Name: Avani Narayan
# Group Members: None

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


class NucParams:
    '''
    This is the NucParams class. It's purpose is to create a NucParams object
    and perform functions necessary for Lab4
    '''
    rnaCodonTable = {
    # RNA codon table
    # U
    'UUU': 'F', 'UCU': 'S', 'UAU': 'Y', 'UGU': 'C',  # UxU
    'UUC': 'F', 'UCC': 'S', 'UAC': 'Y', 'UGC': 'C',  # UxC
    'UUA': 'L', 'UCA': 'S', 'UAA': '-', 'UGA': '-',  # UxA
    'UUG': 'L', 'UCG': 'S', 'UAG': '-', 'UGG': 'W',  # UxG
    # C
    'CUU': 'L', 'CCU': 'P', 'CAU': 'H', 'CGU': 'R',  # CxU
    'CUC': 'L', 'CCC': 'P', 'CAC': 'H', 'CGC': 'R',  # CxC
    'CUA': 'L', 'CCA': 'P', 'CAA': 'Q', 'CGA': 'R',  # CxA
    'CUG': 'L', 'CCG': 'P', 'CAG': 'Q', 'CGG': 'R',  # CxG
    # A
    'AUU': 'I', 'ACU': 'T', 'AAU': 'N', 'AGU': 'S',  # AxU
    'AUC': 'I', 'ACC': 'T', 'AAC': 'N', 'AGC': 'S',  # AxC
    'AUA': 'I', 'ACA': 'T', 'AAA': 'K', 'AGA': 'R',  # AxA
    'AUG': 'M', 'ACG': 'T', 'AAG': 'K', 'AGG': 'R',  # AxG
    # G
    'GUU': 'V', 'GCU': 'A', 'GAU': 'D', 'GGU': 'G',  # GxU
    'GUC': 'V', 'GCC': 'A', 'GAC': 'D', 'GGC': 'G',  # GxC
    'GUA': 'V', 'GCA': 'A', 'GAA': 'E', 'GGA': 'G',  # GxA
    'GUG': 'V', 'GCG': 'A', 'GAG': 'E', 'GGG': 'G'  # GxG
    }
    dnaCodonTable = {key.replace('U','T'):value for key, value in rnaCodonTable.items()}

    def __init__ (self, inString=''):
        '''
        The init method creates dicitonaries used for storing codon, amino acid
        and base counts. It also calls addSequence in case the object gets passed in a 
        string.
        '''
        self.codonDict = {}
        self.aaDict = {}
        self.addSequence(inString)
        self.letterDict = {'A': 0, 'C': 0, 'G': 0, 'T': 0, 'U': 0, 'N': 0}
        return
        
    def addSequence (self, inSeq):
        '''
        The addSequence function performs all the necessary components to add
        values passed in to their respective dicionaries. It has a temporary string called myString.
        When myString has a length of 3, the function checks if the string exists in either of the rna or dna 
        tables provided. If it does not exist, we simply ignore the string an move on, without altering the rest 
        of the inputted string. It then checks if myString is in the DNA table. If it is, we convert it to its RNA
        counterpart. We then find the corresponding amino acid, and incriment both the count of the codon and the 
        amino acid and set the count back to 0 and myString back to the empty string.
        '''
        if inSeq == "":
            return
        count = 0
        myString = ''
        #for loop that goes through each letter in the sequence
        for letter in inSeq:
            myString += letter #add new letter to our temporary string
            count += 1 #incriment our counter
            if letter in self.letterDict: #if the new letter is a valid base, incriment the value in our dictionary and incriment our base counter
                self.letterDict[letter] += 1
            
            if count == 3: # go here when you have a full codon
                if (myString not in NucParams.rnaCodonTable) and (myString not in NucParams.dnaCodonTable): #check if the codon is in either dictionary, if not ignore and move on
                    count = 0
                    myString = ''
                    continue
                elif myString in NucParams.dnaCodonTable: #check if its in DNA dicitonary and replace the T's with U's
                    myString = myString.replace('T','U')
                aa = NucParams.rnaCodonTable[myString] #get the aa value of the codon
                if aa in self.aaDict: #check if this aa is already in our dictionary, if it is incriment by one, or else set it equal to one
                    self.aaDict[aa] += 1
                else:
                    self.aaDict[aa] = 1
                #check if this codon is already in our dicitionary, if it is incriment by one, or else set it equal to one, both cases reset counter and temporary string
                if myString in self.codonDict:
                    self.codonDict[myString] += 1
                    myString = ''
                    count = 0
                else:
                    self.codonDict[myString] = 1
                    myString = ''
                    count = 0

        return
    
    def aaComposition(self):
        '''
        The aaComposition function returns the aaDict diciontary modified in addSequence. 
        '''
        return self.aaDict
    def nucComposition(self):
        '''
        The nucComposition function returns the letterDict dicitonary modified in addSequence
        '''
        return self.letterDict
    def codonComposition(self):
        '''
        The codonComposition function returns the codonDict diciotnary modified in addSequence
        '''
        return self.codonDict
    def nucCount(self):
        '''
        The nucCount function returns the sum of all the values from the letterDict
        dictionary modified in addSequence
        '''
        return sum(self.letterDict.values())
