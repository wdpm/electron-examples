#pragma once

#include <napi.h>
using namespace Napi;

class MyWorker : public AsyncWorker
{
public:
    MyWorker(Function &callback, int runTime);
    virtual ~MyWorker(){};
    void Execute();
    void OnOK();

private:
    int runTime;
};