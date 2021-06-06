#!/usr/bin/env python3 
# Name: Avani Narayan  
# Group Members: None

'''
This program calculates the bond length and angles of three
sets of atomic coordinates provided on one line of input
'''

import math
class Triad :
    """
    Calculate angles and distances among a triad of points.
 
    Author: David Bernick
    Date: March 21, 2013
    Points can be supplied in any dimensional space as long as they are consistent.
    Points are supplied as tupels in n-dimensions, and there should be three
    of those to make the triad. Each point is positionally named as p,q,r
    and the corresponding angles are then angleP, angleQ and angleR.
    Distances are given by dPQ(), dPR() and dQR()
 
    Required Modules: math
    initialized: 3 positional tuples representing Points in n-space
             p1 = Triad( p=(1,0,0), q=(0,0,0), r=(0,1,0) )
    attributes: p,q,r the 3 tuples representing points in N-space
    methods:  angleP(), angleR(), angleQ() angles measured in radians
          dPQ(), dPR(), dQR() distances in the same units of p,q,r
 
    """
 
    def __init__(self,p,q,r) :
        """ Construct a Triad. 
        
        Example construction:
            p1 = Triad( p=(1.,0.,0.), q=(0.,0.,0.), r=(0.,0.,0.) ). 
        """
        self.p = p
        self.q = q
        self.r = r
# private helper methods
    def d2 (self,a,b) : # calculate squared distance of point a to b
        return float(sum((ia-ib)*(ia-ib)  for  ia,ib in zip (a,b)))
    
    def dot (self,a,b) : # dotProd of standard vectors a,b
        return float(sum(ia*ib for ia,ib in zip(a,b)))
    
    def ndot (self,a,b,c) : # dotProd of vec. a,c standardized to b
        return float(sum((ia-ib)*(ic-ib) for ia,ib,ic in zip (a,b,c)))
    
# calculate lengths(distances) of segments PQ, PR and QR
    def dPQ (self):
        """ Provides the distance between point p and point q """
        return math.sqrt(self.d2(self.p,self.q))
    
    def dPR (self):
        """ Provides the distance between point p and point r """
        return math.sqrt(self.d2(self.p,self.r))
    
    def dQR (self):
        """ Provides the distance between point q and point r """
        return math.sqrt(self.d2(self.q,self.r))
    
    def angleP (self) :
        """ Provides the angle made at point p by segments pq and pr (radians). """
        return math.acos(self.ndot(self.q,self.p,self.r) /   math.sqrt(self.d2(self.q,self.p)*self.d2(self.r,self.p)))
    
    def angleQ (self) :
        """ Provides the angle made at point q by segments qp and qr (radians). """
        return math.acos(self.ndot(self.p,self.q,self.r) /  math.sqrt(self.d2(self.p,self.q)*self.d2(self.r,self.q)))
 
    def angleR (self) :
        """ Provides the angle made at point r by segments rp and rq (radians). """
        return math.acos(self.ndot(self.p,self.r,self.q) /  math.sqrt(self.d2(self.p,self.r)*self.d2(self.q,self.r)))

def main():
    ''' This function takes the input from the user and
    calculates the bond length and angles from the given atomic coordinates
    Example input: C = (39.447, 94.657, 11.824) N = (39.292, 95.716, 11.027) Ca = (39.462, 97.101, 11.465)
    Example output: N-C bond length = 1.33
                    N-Ca bond length = 1.46
                    C-N-Ca bond angle = 124.0
    This program assumes that the flaot values for each tuple are in splits[2-4], splits[7-9] and splits [12-14]
    '''-
    data = input('Atomic Coordinates?')
    #Split the input data by the replacing unwanted symbols
    splits = data.replace(",", "")
    splits = splits.replace("=", "")
    splits = splits.replace("(", "")
    splits = splits.replace(")", "")
    splits = splits.split(" ")
    #Make our tuples by converting the string values to floats
    Tuple1 = (float(splits[2]), float(splits[3]),float(splits[4]))
    Tuple2 = (float(splits[7]), float(splits[8]),float(splits[9]))
    Tuple3 = (float(splits[12]), float(splits[13]),float(splits[14]))
    #Set the triad equal to the tuple variables
    myTriad = Triad(p = Tuple1, q = Tuple2, r = Tuple3)
    #Get the desired values and output them
    NC_bond = myTriad.dPQ()
    print("N-C bond length = {:.2f}".format(NC_bond))
    NCa_bond = myTriad.dQR()
    print("N-Ca bond length = {:.2f}".format(NCa_bond))
    bond_angle = myTriad.angleQ()
    print("C-N-Ca bond angle = {:.1f}".format(math.degrees(bond_angle)))

main()