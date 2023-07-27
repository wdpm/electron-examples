{
  "targets": [
    {
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      "target_name": "addon",
      'include_dirs': ["<!(node -p \"require('node-addon-api').include_dir\")"],
      "sources": [ "./hello.cc","./MyWorker.cc" ]
    }
  ]
}