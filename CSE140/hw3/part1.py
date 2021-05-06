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

print('Rook Jumping Maze size(5-10)?')
answer = int(input())
rjm = RJM(answer)
for i in range(answer):
    str1 = ""
    for j in rjm[i]:
        str2 = str(j)
        str1 += str2 + " "
    print(str1)