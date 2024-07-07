
Developer install
=================


To install a developer version of betterwithdata_viz, you will first need to clone
the repository::

    git clone https://github.com/fhstp/betterwithdata-viz
    cd betterwithdata-viz

Next, install it with a develop install using pip::

    pip install -e .


If you are planning on working on the JS/frontend code, you should also do
a link installation of the extension::

    jupyter nbextension install [--sys-prefix / --user / --system] --symlink --py betterwithdata_viz

    jupyter nbextension enable [--sys-prefix / --user / --system] --py betterwithdata_viz

with the `appropriate flag`_. Or, if you are using Jupyterlab::

    jupyter labextension install .


.. links

.. _`appropriate flag`: https://jupyter-notebook.readthedocs.io/en/stable/extending/frontend_extensions.html#installing-and-enabling-extensions
