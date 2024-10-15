# -*- mode: python ; coding: utf-8 -*-

import os
import sys

# Determine base path for accessing files
if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS  # For PyInstaller bundled executable
else:
    base_path = os.path.dirname(os.path.abspath(__name__))  # Current directory

a = Analysis(
    [os.path.join(base_path, 'app', 'main.py')],  # Use a relative path
    pathex=[],
    binaries=[],
    datas=[],  # Include any data files needed
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='main',  # The name of the output executable
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,  # Set to True if you want to see console output
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
