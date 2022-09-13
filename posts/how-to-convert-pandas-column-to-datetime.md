---
title: 'How to Convert Pandas Column to DateTime'
---

Suppose, you have a column named ‘date’ in pandas data frame df. It represents a date and/or time, but pandas thinks it just a string (or an object) and you can’t apply all date/time-specific operations on it. The solution is simple:

	df['date'] =  pandas.to_datetime(df['date'])

though the [to_datetime](http://pandas-docs.github.io/pandas-docs-travis/generated/pandas.to_datetime.html) function is smart enough to recognize date/time [format](https://pyformat.info/#datetime), you can add your own format specification:

	df['date'] =  pandas.to_datetime(df['date'], format='%d%b%Y:%H:%M:%S.%f')