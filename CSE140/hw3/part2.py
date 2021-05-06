import random
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
answer = 5
rjm = RJM(answer)
for i in range(answer):
    str1 = ""
    for j in rjm[i]:
        str2 = str(j)
        str1 += str2 + " "
    print(str1)
print("Moves from start:")
bfs = BFS(rjm)
for i in range(answer):
    str1 = ""
    for j in bfs[i]:
        if(j < 0):
            str2 = "--"
            str1 += str2
        else:
            str2 = str(j)
            str1 += " " + str2
    print(str1)
print(evalFunc(bfs))