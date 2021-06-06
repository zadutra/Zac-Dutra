#!/usr/bin/env python3 
# Name: Avani Narayan  
# Group Members: None
'''
This program parses information from a FASTQ formatted input and ouputs the 
required fields
input: FASTQ string
output: Parsed output information
'''

class FastqString (str):
    ''' 
    This is the FastqString class which has one function
    '''
    def parse(self):
        ''' This method parses
        the string and prints out the required output'''
        splits = self.spl
        it(":")
        print("Instrument =", format(splits[0].replace("@", "")))
        print("Run ID =", format(splits[1]))
        print("Flow Cell ID =", format(splits[2]))
        print("Flow Cell Lane =", format(splits[3]))
        print("Tile Number =", format(splits[4]))
        print("X-coord =", format(splits[5]))
        print("Y-coord =", format(splits[6]))
        
def main():
    ''' 
    This function gets the input from the user and calls
    the parse() method which prints out the necessary output
    '''
    data = input('FASTQ data?')
    thisData = FastqString (data)
    thisData.parse()

main()