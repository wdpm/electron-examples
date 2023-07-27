#include "MyWorker.h"

Napi::String Hello(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    return Napi::String::New(env, "world");
}

Napi::Value Add(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 2)
    {
        Napi::TypeError::New(env, "Wrong arguments numbers").ThrowAsJavaScriptException();
        return env.Null();
    }
    double result = 0;
    for (int i = 0; i < info.Length(); i++)
    {
        if (!info[i].IsNumber())
        {
            Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
            return env.Null();
        }
        double arg = info[i].As<Napi::Number>().DoubleValue();
        result += arg;
    }
    Napi::Number resultVal = Napi::Number::New(env, result);
    return resultVal;
}

Napi::Value AsyncMethod(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::Object runInfo = info[0].As<Napi::Object>();
    int timeSpan = runInfo.Get("timeSpan").As<Napi::Number>();
    Napi::Function callback = runInfo.Get("callBack").As<Napi::Function>();
    MyWorker *asyncWorker = new MyWorker(callback, timeSpan);
    asyncWorker->Queue();
    Napi::Object obj = Napi::Object::New(env);
    obj.Set(Napi::String::New(env, "msg"), Napi::String::New(env, "please wait..."));
    return obj;
};

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "hello"), Napi::Function::New(env, Hello));
    exports.Set(Napi::String::New(env, "add"), Napi::Function::New(env, Add));
    exports.Set(Napi::String::New(env, "asyncMethod"), Napi::Function::New(env, AsyncMethod));
    return exports;
}
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)