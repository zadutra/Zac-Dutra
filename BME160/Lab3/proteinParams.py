#!/usr/bin/env python3
# Name: Avani Narayan
# Group Members: None

class ProteinParam :
# These tables are for calculating:
#     molecular weight (aa2mw), along with the mol. weight of H2O (mwH2O)
#     absorbance at 280 nm (aa2abs280)
#     pKa of positively charged Amino Acids (aa2chargePos)
#     pKa of negatively charged Amino acids (aa2chargeNeg)
#     and the constants aaNterm and aaCterm for pKa of the respective termini
#  Feel free to move these to appropriate methods as you like

# As written, these are accessed as class attributes, for example:
# ProteinParam.aa2mw['A'] or ProteinParam.mwH2O

    aa2mw = {
        'A': 89.093,  'G': 75.067,  'M': 149.211, 'S': 105.093, 'C': 121.158,
        'H': 155.155, 'N': 132.118, 'T': 119.119, 'D': 133.103, 'I': 131.173,
        'P': 115.131, 'V': 117.146, 'E': 147.129, 'K': 146.188, 'Q': 146.145,
        'W': 204.225,  'F': 165.189, 'L': 131.173, 'R': 174.201, 'Y': 181.189
        }

    mwH2O = 18.015
    aa2abs280= {'Y':1490, 'W': 5500, 'C': 125}

    aa2chargePos = {'K': 10.5, 'R':12.4, 'H':6}
    aa2chargeNeg = {'D': 3.86, 'E': 4.25, 'C': 8.33, 'Y': 10}
    aaNterm = 9.69
    aaCterm = 2.34

    def __init__ (self, protein):
        '''
        This __init__ method take the input string and stores only the valid values in the 
        aaComp dictionary. If the user inputs control D, the program ends
        '''
        if EOFError: #check for control D
            sys.exit(0)

        self.input = protein.upper()
        self.aaComp = {}
        
        for aa in self.aa2mw.keys(): #iterates through each key of the given dictionary and counts how many of each key is in the input string
            self.aaComp[aa] = float(self.input.count(aa))

    def aaCount (self):
        '''
        This function counts the number of amino acids in the given input string
        '''
        total = 0
        for aa in range(0,len(self.input)): #for each element in the given input string
            if self.input[aa].upper() in self.aa2mw.keys(): #check if the uppercase value equals a key in the dictionary
                total += 1
        return total

    def pI (self):
        '''
        This function for the Ph level that makes the sequence as neutral as possible
        '''
        bestPH = 0
        tempPH = 0
        loopCheck = 2**10 #temporary large value for initial loop
        
        while tempPH <= 14.0: #stop when pH is equal to 14
            charge = abs(self._charge_(tempPH)) # use the _charge_ function from earlier
            if charge < loopCheck: #if the current charge is less that the best charge, replace the best charge with the current charge and change the loop variable
                loopCheck = charge
                bestPH = tempPH
            tempPH += 0.01 #incriment tempPH
        
        return bestPH
        

    def aaComposition (self) :
        '''
        This function returns the aaComp dictionary defined in the __init__ method
        '''

        return self.aaDict

    def _charge_ (self, pH):
        '''
        This function finds the proteins pH charge value using the N and C terminus provided
        '''
        P_charge = 0
        N_charge = 0
        totalCharge = 0
        
        #find the positive charge
        for aa in self.aa2chargePos:
            count = self.aaComp[aa] #get amount
            P_charge += count * ((10**self.aa2chargePos[aa]) / (10**self.aa2chargePos[aa] + 10**pH)) #converted the equation from the given formula into code
        P_charge += (10**self.aaNterm) / (10**self.aaNterm + 10**pH) #add the N terminus 
            
        #find the negative charge
        for aa in self.aa2chargeNeg:
            count = self.aaComp[aa] #get count
            N_charge += count * ((10**pH) / (10**self.aa2chargeNeg[aa] + 10**pH)) #converted the equation from the given formula
        N_charge += (10**pH) / (10**self.aaCterm + 10**pH) #add the C terminus
        
        totalCharge = P_charge - N_charge
        return totalCharge

    def molarExtinction (self):
        '''
        This function provides the extinction coefficient using the given 
        aa2abs280 dictionary
        '''
        tyrosine = self.aaComp['Y'] * self.aa2abs280['Y']
        tryptophan = self.aaComp['W'] * self.aa2abs280['W']
        cystine = self.aaComp['C'] * self.aa2abs280['C']
        return tyrosine + tryptophan + cystine

    def massExtinction (self):
        myMW =  self.molecularWeight()
        return self.molarExtinction() / myMW if myMW else 0.0

    def molecularWeight (self):
        '''
        This function calculates the molecular weight of the given protein sequence
        by subtracting the total weight by the water weight
        '''
        totalWeight = 0 # total weight value
        waterWeight = self.mwH2O * (self.aaCount() - 1) # the amount in water of our entire protein
        for aa, count in self.aaComp.items(): # go through each item in the aaComp dictionary, aa is the key, count is the value
            totalWeight += (count * self.aa2mw[aa]) #add the total to the running sum of the toal weight
        return totalWeight - waterWeight #return the difference between the weight of the whole protein minus the water weight of the protein

# Please do not modify any of the following.  This will produce a standard output that can be parsed
    
import sys
def main():
    inString = input('protein sequence?')
    while inString :
        myParamMaker = ProteinParam(inString)
        myAAnumber = myParamMaker.aaCount()
        print ("Number of Amino Acids: {aaNum}".format(aaNum = myAAnumber))
        print ("Molecular Weight: {:.1f}".format(myParamMaker.molecularWeight()))
        print ("molar Extinction coefficient: {:.2f}".format(myParamMaker.molarExtinction()))
        print ("mass Extinction coefficient: {:.2f}".format(myParamMaker.massExtinction()))
        print ("Theoretical pI: {:.2f}".format(myParamMaker.pI()))
        print ("Amino acid composition:")
        
        if myAAnumber == 0 : myAAnumber = 1  # handles the case where no AA are present 
        
        for aa,n in sorted(myParamMaker.aaComposition().items(), 
                           key= lambda item:item[0]):
            print ("\t{} = {:.2%}".format(aa, n/myAAnumber))
    
        inString = input('protein sequence?')

if __name__ == "__main__":
    main()