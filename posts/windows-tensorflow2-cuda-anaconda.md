---
title: 'Windows + TensorFlow 2 + CUDA + Anaconda'
---

The rumor is that installing Tensorflow with CUDA on Windows is a hard task but this time for me everything went more or less smoothly, thank God, and I’d like to record this path for the future.

So, I need to fit a neural network using TensorFlow 2 and my GeForce GTX 1080 Ti to speed the process up. The process of TensorFlow installation is described [here](https://www.tensorflow.org/install) and I’m going to go through those points.

## CUDA Toolkit
To harness the power of GPU you need to install NVIDIA’s CUDA Toolkit. It provides an environment for accessing the multi-core system of a GPU and using it for your own good. I suppose that proper [NVIDIA® GPU drivers](https://www.nvidia.com/drivers) are already installed so you can go and [download the latest release of CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit-archive). In my case, I took v10.1 and went through the express installation.

## cuDNN SDK
In order to use GPU for working with deep neural networks, you also need the [NVIDIA CUDA® Deep Neural Network library](https://developer.nvidia.com/cudnn) (cuDNN). It’s given only for registered NVIDIA developers so if you don’t have an account on developer.nvidia.com you will need to create one, it’s free. [Download cuDNN](https://developer.nvidia.com/rdp/cudnn-download) according to the CUDA version you installed during the previous step (I took v7.6.5).

Then you need to copy files in the downloaded zip file (in my case was named cudnn-10.1-windows10-x64-v7.6.5.32.zip) to CUDA’s installation directory:

* cuda\bin\\**cudnn64_7.dll** goes to C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.1\bin
* cuda\include\\**cudnn.h** goes to C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.1\include
* cuda\lib\x64\\**cudnn.lib** goes to C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.1\lib\x64

In other words, you can simply copy the whole content of ‘cuda’ folder in the zip file to the folder where CUDA is installed (in my case C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.1).

## PATH variable
It’s recommended to add the following paths into your PATH environment variable:

* C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.1\bin
* C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.1\extras\CUPTI\libx64
* C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.1\include

Almost all of them were already added though, so I had to add only the second one.

## Tensorflow 2
Now it’s time to install Tensorflow to our development environment. I use [Anaconda](https://www.anaconda.com/) and I hope it’s already installed on your PC.

First time I installed TensorFlow into the base virtual environment and everything worked well until I installed some other pip package that broke everything and even `import tensorflow` command resulted in an ugly error like

	ERROR:root:Internal Python error in the inspect module.
	Below is the traceback from this internal error.
	Traceback (most recent call last):
	File "d:\pyt\lib\site-packages\IPython\core\interactiveshell.py", line 3326, in run_code
	exec(code_obj, self.user_global_ns, self.user_ns)...

The only way of healing this was to create a separate clean development environment in Conda (the TensorFlow developers also [recommend](https://www.tensorflow.org/install/pip?lang=python3#2-create-a-virtual-environment-recommended) this).

To create a new virtual environment in Conda run

	conda create --name myenv

Then install pip into it

	conda install -n myenv pip

Then activate the environment

	conda activate myenv

And finally install TensorFlow

	pip install tensorflow

! I chose to use pip since conda install -c anaconda tensorflow resulted in a strange error (UnsatisfiableError: The following specifications were found to be incompatible with the existing python installation in your environment…). It might be caused by Python 3.8 installed in the new environment. Anyway, pip worked fine.

## Add the new environment to Jupyter Notebook
If you use Jupyter Notebook then it makes sense to add the newly created virtual environment to it. It’s done using the ipykernel module:

	conda install -c anaconda ipykernel

	python -m ipykernel install --user --name=myenv

After this, you will be able to see your environment in the list of kernels (don’t forget to refresh the page):
![New Jupyter Kernel](new_jupyter_kernel.png)

## Test GPU availability
It might be interesting to check whether Tensorflow sees your GPU or not. For TensorFlow 2 it’s done with the following python commands:

	import tensorflow
	tensorflow.config.list_physical_devices('GPU')

in case of success, you should see something like

	[PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]

## P.S. installing other packages
This section is just for my personal reference but maybe you may benefit from it as well.

In order to do image recognition and other stuff, you will probably also need to install some other packages:

* `conda install matplotlib`
* `pip install opencv-python`
* `pip install keras`
* `pip install mysql-connector`
* `pip install pillow` (e.g. if you get something like ImportError: Could not import PIL.Image. The use of `load_img` requires PIL)