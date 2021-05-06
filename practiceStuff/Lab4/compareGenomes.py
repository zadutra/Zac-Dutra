class NucParams:
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
        self.codonDict = {}
        self.aaDict = {}
        self.addSequence(inString)
        self.letterDict = {'A': 0, 'C': 0, 'G': 0, 'T': 0, 'U': 0, 'N': 0}
        return
        
    def addSequence (self, inSeq):
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
        return self.aaDict
    def nucComposition(self):
        return self.letterDict
    def codonComposition(self):
        return self.codonDict
    def nucCount(self):
        return sum(self.letterDict.values())
