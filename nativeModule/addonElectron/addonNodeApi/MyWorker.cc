#pragma execution_character_set("utf-8")
#include "MyWorker.h"
#include <chrono>
#include <thread>

MyWorker::MyWorker(Function &callback, int runTime)
    : AsyncWorker(callback), runTime(runTime){};

void MyWorker::Execute()
{
    std::this_thread::sleep_for(std::chrono::seconds(runTime));
    if (runTime == 4)
    {
        SetError("failed after 'working' 4 seconds.");
    }
};

void MyWorker::OnOK()
{
    Napi::Array arr = Napi::Array::New(Env());
    arr[Number::New(Env(), 0)] = String::New(Env(), "test1");
    arr[Number::New(Env(), 1)] = String::New(Env(), "test2");
    arr[Number::New(Env(), 2)] = Number::New(Env(), 123);
    // arr.Set(Number::New(Env(), 0), String::New(Env(), "test"));
    // arr.Set(Number::New(Env(), 1), String::New(Env(), "test2"));
    // arr.Set(2, Napi::Number::New(env, runTime));
    Callback().Call({Env().Null(), arr});
};