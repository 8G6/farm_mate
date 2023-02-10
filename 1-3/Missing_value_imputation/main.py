import pandas as pd
from matplotlib.pyplot import plot,stem,bar
from numpy import array
from scipy.optimize import curve_fit

df  = pd.read_csv('https://raw.githubusercontent.com/8G6/farm_mate/main/Missing_value_imputation/dimonds.csv')

def objective(x, a, b,c):
 return a * x**2 + b*x + c

a,b = curve_fit(objective,df['price'],df['carat'])


err=[]
n=len(df['price'])
for i in range(n):
  pre = df['price'][i]
  pre = pre**2 * a[0] + pre*a[1] + a[2]
  err.append(
      ((df['carat'] - pre)**2)/n
  )
  print(i*100/n,"% complte",end='\r')

print(sum(err)**0.5)