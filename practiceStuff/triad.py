#!/usr/bin/env python3 
# Name: Avani Narayan  
# Group Members: None
import math
import numpy as np
class Triad:
    def __init__(self,p,q,r) :
        """ Construct a Triad.  
        
        Example object construction:
            p1 = Triad( p=(1.,0.,0.), q=(0.,0.,0.), r=(0.,0.,0.) ). 
        """
        self.p = p
        self.q = q
        self.r = r

    '''
        This function calculates the bond length of tuples passed in as
        A and B
        input: Two tuples
        output: Length between the tuples
    '''
    def bondLength(self, a, b):
        summ = 0
        for i in range(3):
            diff = a[i] - b[i]
            squared = diff * diff
            summ += squared
        return math.sqrt(summ)

    def dPQ (self):
        """ Provides the distance between point p and point q """
        summ = 0
        for i in range(3):
            diff = self.p[i] - self.q[i]
            squared = diff * diff
            summ += squared
        return math.sqrt(summ)
    
    def dPR (self):
        """ Provides the distance between point p and point r """
        summ = 0
        for i in range(3):
            diff = self.p[i] - self.r[i]
            squared = diff * diff
            summ += squared
        return math.sqrt(summ)
    
    def dQR (self):
        """ Provides the distance between point q and point r """
        summ = 0
        for i in range(3):
            diff = self.q[i] - self.r[i]
            squared = diff * diff
            summ += squared
        return math.sqrt(summ)
    
    def angleP (self) :
        """ Provides the angle made at point p by segments pq and pr in degrees. """
        summ = 0
        for i in range(3):
            diff1 = self.q[i] - self.p[i]
            diff2 = self.r[i]- self.p[i]
            summ += (diff1 * diff2)
        output = math.acos(summ/(self.bondLength(self.q, self.p) * self.bondLength(self.r, self.p)))
        output = math.degrees(output)
        return output
    
    def angleQ (self) :
        """ Provides the angle made at point q by segments qp and qr in degrees. """
        summ = 0
        for i in range(3):
            diff1 = self.p[i] - self.q[i]
            diff2 = self.r[i]- self.q[i]
            summ += (diff1 * diff2)
        output = math.acos(summ/(self.bondLength(self.q, self.p) * self.bondLength(self.q, self.r)))
        output = math.degrees(output)
        return output
        
    def angleR (self) :
        """ Provides the angle made at point r by segments rp and rq in degrees. """
        summ = 0
        for i in range(3):
            diff1 = self.q[i] - self.r[i]
            diff2 = self.p[i]- self.r[i]
            summ += (diff1 * diff2)
        output = math.acos(summ/(self.bondLength(self.r, self.p) * self.bondLength(self.r, self.q)))
        output = math.degrees(output)
        return output
        