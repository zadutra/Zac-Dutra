import random
import copy
def RJM(n):
    rows, cols = (n, n)
    Arr = [[] for i in range(n)]
    for i in range(n):
        for j in range(n):
            if((i == n-1) and (j is n-1)):
                Arr[i].append(0)
                break
            thisMax = max(n - i, i -1 , n - j, j - 1)
            Arr[i].append(random.randrange(1, thisMax))
    return Arr
def BFS(A):
    queue = []
    size = len(A)
    newArr = [[-100, -100, -100, -100, -100] for i in range(size)]
    depth = 0
    x = 0
    y = 0
    queue.append((A[0][0], x, y, depth))
    newArr[0][0] = depth
    while queue != []:
        value = queue[0][0]
        x = queue[0][1]
        y = queue[0][2]
        depth = queue[0][3] + 1
        x_right = x + value
        x_left = x - value
        y_up = y - value
        y_down = y + value
        if((x_right < size) and (newArr[x_right][y] < 0)):
            newArr[x_right][y] = depth
            queue.append((A[x_right][y], x_right, y, depth))
        if((x_left >= 0) and (newArr[x_left][y] < 0)):
            newArr[x_left][y] = depth
            queue.append((A[x_left][y], x_left, y, depth))
        if((y_up >= 0) and (newArr[x][y_up] < 0)):
            newArr[x][y_up] = depth
            queue.append((A[x][y_up], x, y_up, depth))
        if((y_down < size) and (newArr[x][y_down] < 0)):
            newArr[x][y_down] = depth
            queue.append((A[x][y_down], x, y_down, depth))
        queue.pop(0)
    return newArr

def evalFunc(A):
    if(A[len(A)-1][len(A)-1] == "--"):
        return 1000000
    else:
        value = A[len(A)-1][len(A)-1]
        value *= -1
        return value

def hillClimbRandomUphill(RJM, iterations, prob):
    n = len(RJM)
    best = [[] for i in range(n)]
    bestResult = [[] for i in range(n)]
    temp = copy.deepcopy(RJM)
    temp2 = [[] for i in range(n)]
    Eval = 100000
    for p in range(iterations):
        rand1 = random.randrange(0, n)
        rand2 = random.randrange(0, n)
        for i in range(n):
            for j in range(n):
                temp2[i].append(temp[i][j])
        thisMax = max(n - rand1, rand1 -1 , n - rand2, rand2 - 1)
        while(((rand1 == 4) and (rand2 == 4)) or (thisMax - 1 == 0)):
            rand1 = random.randrange(0, n)
            rand2 = random.randrange(0, n)
            thisMax = max(n - rand1, rand1 -1 , n - rand2, rand2 - 1)
        if(thisMax == 2):
            if(temp2[rand1][rand2] == 1):
                temp2[rand1][rand2] = 2
            else:
                temp2[rand1][rand2] = 1
        else:
            temp2[rand1][rand2] = random.randrange(1, thisMax)
        result1 = BFS(temp)
        result2 = BFS(temp2)
        check1 = evalFunc(result1)
        check2 = evalFunc(result2)
        if((check2 <= check1) or (prob > random.random())):
            temp = [[] for i in range(n)]
            for i in range(n):
                for j in range(n):
                    temp[i].append(temp2[i][j])
            if(check2 <= Eval):
                best = [[] for i in range(n)]
                bestResult = [[] for i in range(n)]
                for i in range(n):
                    for j in range(n):
                        best[i].append(temp2[i][j])
                        bestResult[i].append(result2[i][j])
                Eval = check2
        else:
            temp2 = [[] for k in range(n)]
    return best, bestResult, Eval

def printArr(A):
    n = len(A)
    for i in range(n):
        str1 = ""
        for j in A[i]:
            str2 = str(j)
            str1 += str2 + " "
        print(str1)
print("Iterations?")
iters = int(input())
print("Uphill step probability?")
prob = float(input())
answer = 5
rjm = RJM(answer)
solution = hillClimbRandomUphill(rjm, iters, prob)
printArr(solution[0])
print("Moves from start:")
for i in range(answer):
    str1 = ""
    for j in solution[1][i]:
        if(j < 0):
            str2 = "--"
            str1 += str2
        else:
            str2 = str(j)
            str1 += " " + str2
    print(str1)
print(solution[2])

