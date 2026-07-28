cmake_minimum_required(VERSION 3.14)
project(yaman_lab_messenger LANGUAGES CXX)

set(BINARY_NAME "yaman_lab_messenger")

cmake_policy(SET CMP0063 NEW)

set(CMAKE_INSTALL_PREFIX "${CMAKE_BINARY_DIR}/runner")

include(flutter/generated_plugins.cmake)

add_subdirectory(runner)
