pascal=[[1],[1,1]]
n=int(input())
for i in range(2,n):
    pascal.append([1]*(i+1))
    for j in range(1,i):
        pascal[i][j]=pascal[i-1][j-1]+pascal[i-1][j]
print(pascal)