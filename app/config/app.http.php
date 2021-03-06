<?php

return [
    'database' => include __DIR__ . '/database.php',
    'routes'   => [
        '[/]'  => [
            'controller' => 'Scroll\Http\Controller\IndexController',
            'action'     => 'index'
        ],
        '/users[/]' => [
            'controller' => 'Scroll\Http\Controller\IndexController',
            'action'     => 'users'
        ],
        '/users/count[/]' => [
            'controller' => 'Scroll\Http\Controller\IndexController',
            'action'     => 'usersCount'
        ],
        '/export[/]'  => [
            'controller' => 'Scroll\Http\Controller\IndexController',
            'action'     => 'export'
        ],
        '*'    => [
            'controller' => 'Scroll\Http\Controller\IndexController',
            'action'     => 'error'
        ]
    ],
    'http_options_headers' => [
        'Access-Control-Allow-Origin'  => '*',
        'Access-Control-Allow-Headers' => 'Accept, Authorization, Content-Type, X-Resource, X-Permission',
        'Access-Control-Allow-Methods' => 'HEAD, OPTIONS, GET, PUT, POST, PATCH, DELETE',
        'Content-Type'                 => 'application/json'
    ],
    'pagination' => 20,
    'numbered'   => true,
    'no_results' => 'There are currently no results.'
];