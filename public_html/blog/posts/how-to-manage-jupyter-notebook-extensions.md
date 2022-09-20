---
title: 'How to manage Jupyter Notebook extensions'
---

Though Jupyter Notebook has been continuously improved, still its basic design doesn’t satisfy the majority of developers who got used to modern feature-rich IDEs. This is where notebook extensions (aka nbextensions) come in. Being not officially related to the Jupyter team, they still can make data scientist’s life much-much easier. Below I’ll describe how to install and enable Jupyter Notebook extensions with conda.

First of all, make sure you’re in the base environment:

* Windows: <kbd>conda activate</kbd>
* Linux: <kbd>source activate</kbd>

Then you can install [jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator), a jupyter server extension that provides GUI for configuring which nbextensions are enabled. It will also make your life easier:

	conda install -c conda-forge jupyter_nbextensions_configurator

Now install [Jupyter notebook extensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions), copy the nbextensions’ javascript and css files into the jupyter server’s search directory, and configure jupyter:
  
    conda install -c conda-forge jupyter_contrib_nbextensions
    jupyter contrib nbextension install --user
    
That’s it. Restart your Jupyter Notebook and you’ll see a Nbextensions tab where you can enable and disable installed notebook extensions:

![Configurable nbextensions](nbextensions.png)

You can also enable/disable extensions in the command line by the following commands:

	jupyter nbextension enable <nbextension require path>
	jupyter nbextension disable <nbextension require path>
