---
title: 'Cursory Data Analysis with Pandas'
---

How to get a brief view on what data poses?

| Method | Description |
| :--------- | :-------------- |
| [describe()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.describe.html#pandas.DataFrame.describe) | provides various statistical information for each column (count, mean, std, etc.)
| [head()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.head.html#pandas.DataFrame.head) | returns first (five by default) rows of DataFrame
| [info()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.info.html) | returns summary of DataFrame such as data types, memory consumption and so on
| [count()](http://pandas.pydata.org/pandas-docs/version/0.17.0/generated/pandas.DataFrame.count.html#pandas.DataFrame.count) | returns series with number of  non-NA/null values for all columns
| [df\[‘column’\].value_counts()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.value_counts.html) | returns counts of unique values in a column
| [df\[‘column’\].nunique()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.nunique.html) | returns number of unique values in a column
| [pandas.tools.plotting.scatter_matrix()](http://pandas.pydata.org/pandas-docs/stable/visualization.html) | draws scatter plots for given data frame
| [df\[‘column’\].hist()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.hist.html) | draws histogram of the column values using matplotlib
| [scipy.stats.probplot(array, plot=plt)](https://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.stats.probplot.html) | draws probability plot to check that the data set follows a normal distribution
| [statsmodels.graphics.gofplots.qqplot(array, line=’s’)](http://www.statsmodels.org/0.6.1/generated/statsmodels.graphics.gofplots.qqplot.html) | draws a QQ-plot
| [scipy.stats.shapiro(array)\[1\]](https://docs.scipy.org/doc/scipy-0.19.0/reference/generated/scipy.stats.shapiro.html) | returns p-value of the Shapiro-Wilk test for normality