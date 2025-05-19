---
title: 'SQL Server Data Analysis using Python and JupyterLab'
---

![JupyterLab](labpreview.png)

Looking for a free tool for SQL Server data analysis? If you are familiar with [Python](https://www.python.org/) I will show you how to use [JupyterLab](https://jupyter.org/) as a great data analysis tool.

## Why Python and JupyterLab?
**Python** is a multi-purpose language but the abundance of data-processing libraries makes it a really great instrument for data manipulation and data analysis. No wonder that this is one of the leading languages used in data science and machine learning.

**JupyterLab** is a web-based tool by Project Jupyter that is a successor of Jupyter Notebook, a computational environment for creating rich interactive documents. JupyterLab allows one to simultaneously work with several files, including Jupyter Notebooks,  in different tabs. Actually it’s just a logical continuation of Jupyter Notebook and should eventually replace it. While JupyterLab can work with different languages (like R and Julia) but in this case, I will focus on Python.

One of the greatest advantages of Project Jupyter is that you can mix code, markup, table, and charts in one file with .ipynb extension. Later you can share this file with your colleagues online or as a simple HTML file if necessary. If your notebook file is available online everybody can view it using [NBViewer](https://nbviewer.jupyter.org/).

## Installing Python and JupyterLab
### 1. Install Anaconda
If you don’t have python and  JupyterLab installed on your computer then the simplest way to do it is by installing [Anaconda](https://www.anaconda.com/), a famous data science platform. It comprises many packages for data analysis including Python itself, Jupyter Notebooks and necessary libraries.  It supports several languages and works on Linux, Windows and Mac OS X.

You can download and install Anaconda [here](https://www.anaconda.com/distribution/).

### 2. Install JupyterLab
Since JupyterLab is not installed automatically by Anaconda, you need to installing it manually by typing the following command (use Anaconda Prompt app if you are working on Windows):

	conda install -c conda-forge jupyterlab

When the installation is completed you can start JupyterLab by typing

	jupyter lab

It should be opened in a new browser tab. At this point, all installation is accomplished and we can proceed with SQL Server data analysis.

## Connecting SQL Server from a Jupyter Notebook
When you start JupyterLab you get to the Launcher where you need to click the Python icon under the “Notebook” section. This will start a new notebook which we will use for connecting to SQL Server and analyzing its data.

First of all, in order to connect SQL Server, you need to install Microsoft ODBC Driver for SQL Server. Here are instructions for [Linux and Mac](https://docs.microsoft.com/en-us/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?view=sql-server-2017#microsoft-odbc-driver-131-for-sql-server) and [Windows](https://docs.microsoft.com/en-us/sql/connect/odbc/windows/microsoft-odbc-driver-for-sql-server-on-windows?view=sql-server-2017).

I will show you two options of SQL Server connection: using pyodbc library and using SQL magic extension.

### Raw way: Using pyodbc library
In this way, we will use python’s [pyodbc](https://github.com/mkleehammer/pyodbc) library that allows connecting to different database sources using ODBC drivers. If this library is not installed on your computer you can do this using conda:

	conda install -c anaconda pyodbc

Now you can use the following sample to connect your database and select some data from a table:

<iframe id="iframe1" src="connecting_with_pyodbc.html" width="100%" height="900" frameborder="no"></iframe>

In this sample, I used the AdventureWorks database and my local SQL Server with SQL Server Authentication mode. You need to change the connection string accordingly.

Also, you can see that I used the [pandas](https://pandas.pydata.org/) library which is the best library for working with heterogeneous data formed into arrays with named columns. It should be already included in your Anaconda installation.

### More ipythonic way: Using  IPython SQL Magic extension
Jupyter Notebook allows using [magic commands](https://ipython.readthedocs.io/en/stable/interactive/magics.html), set of convenient functions helping to solve common problems in data analysis. [IPython SQL magic](https://github.com/catherinedevlin/ipython-sql) extension allows you to execute SQL queries right in your notebook that makes the whole process more natural without adding any additional code.

First, you need to install this extension using conda:

	conda install -c conda-forge ipython-sql

Then you need to load this extension to your notebook using the following directive:

	%load_ext sql

Then you need to use %sql magic to connect your SQL Server and run queries:

<iframe id="iframe2" src="connecting_with_magic.html" width="100%" height="800" frameborder="no"></iframe>

Note, that here I had to URl-encode the connection string in order to pass it to the magic. There are [other options](https://docs.sqlalchemy.org/en/13/dialects/mssql.html#module-sqlalchemy.dialects.mssql.pyodbc) for connection to SQL Server via ODBC, but this one worked for me better and looks more concise (though a bit hard-to-read).

## Analyzing SQL Server Data using python
Uuuhhh, finally we have come to the main point of this post: **data analysis**. This topic is huge but I’m going to show you some main principles and methods so that you can proceed further using the given links to the documentation.

### Using Pandas’ methods
Pandas library provides a bunch of useful methods allowing you to instantly get some statistical information on your data.

Let’s see what we can know about data in FactProductInventory table of our AdventureWorks database. I will use the first method of querying data from SQL Server (the one that uses pyodbc directly) as I’m more get used to it. If you prefer the second method (that uses %sql magic) then you need to use DataFrame() method of the result set received after magic execution to get a DataFrame object.

Let’s put all 776286 records of the table into df variable (which is a DataFrame object) and get some statistical information on each column using [describe()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.describe.html) method:

![DataFrame.describe](df_describe.jpg)

You can see that this method gives such statistics such as total value count, mean value, standard deviation, minimum, maximum and quartile values. This obviously gives garbage for DateKey column (that contains encoded date value) but for UnitCost column we can get a nice overview telling, for example, that while the maximum cost is 1131.25 the half of the units costs 24.65 or less.

Note also in the above example, that I used [head()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.head.html#pandas.DataFrame.head) method to see several (five by default) first rows of the data frame to see whether all data imported correctly.

The [info()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.info.html) method of a DataFrame object returns a summary of DataFrame such as data types, memory consumption, number of values and so on:

![DataFrame.info](df_info.jpg)

Another useful method is [value_counts()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.value_counts.html) that shows how many times each value appears in the set:

![DataFrame.value_counts](df_value_counts.jpg)

It especially useful for discrete values like the ProductKey column but in this data set it appeared to be not representable so I used the UnitCost column instead.

But if you prefer a visual representation of how often each different value in a set of data occurs (so-called frequency distribution) you need to use [hist()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.hist.html) method:

![DataFrame.hist](df_hist.jpg)

DataFrame has huge amount of other useful methods that you can find in the [documentation](https://pandas.pydata.org/pandas-docs/stable/reference/frame.html).