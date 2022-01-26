# coding: utf-8

import sys
from setuptools import setup, find_packages

NAME = "workspaces"
VERSION = "0.0.1"

with open('requirements.txt') as f:
    REQUIRES = f.read().splitlines()

setup(
    name=NAME,
    version=VERSION,
    description="Workspace Manager API",
    url="",
    keywords=["OpenAPI", "Workspace Manager API"],
    install_requires=REQUIRES,
    packages=find_packages(),
    package_data={'': ['openapi/openapi.yaml']},
    include_package_data=True,
    long_description="""\
    Workspace Manager API
    """
)

