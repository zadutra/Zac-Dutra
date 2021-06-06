#!/usr/bin/env python3 
# Name: Avani Narayan  
# Group Members: None

'''
Read a DNA string from user input and return a collapsed substring of embedded Ns to: {count}.

Example: 
input: AaNNNNNNGTC
output: AA{6}GTC

Any lower case letters are converted to uppercase
'''

class DNAstring (str):
    """
    This is the DNAstring class which has 2 functions
    purify: Makes all characters in the string uppercase and replaces the number of consequtive
            N's with a number in brackets {}
    """
    def length (self):
        '''length: returns the length of the DNAstring'''
        return (length(self))
    
    def purify(self):
        '''purify: Makes all characters in the string uppercase and replaces the number of consequtive
            N's with a number in brackets {}'''
        temp = self.upper()
        num = temp.count("N")
        temp = temp.replace("N", "{" + str(num) +  "}", 1)
        temp = temp.replace("N", "")
        return temp
    
def main():
    ''' Get user DNA data and clean it up.'''
    data = input('DNA data?')
    thisDNA = DNAstring (data)
    pureData = thisDNA.purify()
    print (pureData)
    
main()