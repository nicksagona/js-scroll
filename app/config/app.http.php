<?php

return [
    'routes' => [
        '[/]' => [
            'controller' => 'Scroll\Http\Controller\IndexController',
            'action'     => 'index'
        ],
        '*'    => [
            'controller' => 'Scroll\Http\Controller\IndexController',
            'action'     => 'error'
        ]
    ]
];