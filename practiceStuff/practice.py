#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'processLogs' function below.
#
# The function is expected to return a STRING_ARRAY.
# The function accepts following parameters:
#  1. STRING_ARRAY logs
#  2. INTEGER maxSpan
#

def processLogs(logs, maxSpan):
    sign_in = {}
    sign_out = {}
    resultDict = {}
    output = []
    for i in logs:
        temp = i.split()
        if temp[2] == 'sign-in':
            sign_in[temp[0]] = temp[1] #sign in time
            if temp[0] in sign_out:
                t_delta = int(sign_out[temp[0]]) - int(sign_in[temp[0]])
                if t_delta <= maxSpan:
                    resultDict[temp[0]] = t_delta
        if temp[2] == 'sign-out':
            sign_out[temp[0]] = temp[1]
            if temp[0] in sign_in:
                t_delta = int(sign_out[temp[0]]) - int(sign_in[temp[0]])
                if t_delta <= maxSpan:
                    resultDict[temp[0]] = t_delta
    resultDict = sorted(resultDict)
    myList = []
    for i in resultDict:
        temp = int(i)
        myList.append(temp)
    print(myList)
    myList = sorted(myList)
    print(myList)
    return myList

if __name__ == '__main__':
    #fptr = open(os.environ['OUTPUT_PATH'], 'w')

    logs_count = int(input().strip())

    logs = []

    for _ in range(logs_count):
        logs_item = input()
        logs.append(logs_item)

    maxSpan = int(input().strip())

    result = processLogs(logs, maxSpan)
    #print(result)
    '''
    fptr.write('\n'.join(result))
    fptr.write('\n')

    fptr.close()
    '''
