<?php

return [
    'routes' => [
        '[/]' => [
            'controller' => 'Aquatin\Form\Http\Controller\IndexController',
            'action'     => 'index'
        ],
        '/create[/]' => [
            'controller' => 'Aquatin\Form\Http\Controller\IndexController',
            'action'     => 'create'
        ],
        '/upload[/]' => [
            'controller' => 'Aquatin\Form\Http\Controller\IndexController',
            'action'     => 'upload'
        ],
        '/preview[/]' => [
            'controller' => 'Aquatin\Form\Http\Controller\IndexController',
            'action'     => 'preview'
        ],
        '/image[/]' => [
            'controller' => 'Aquatin\Form\Http\Controller\IndexController',
            'action'     => 'image'
        ],
        '/clear[/]' => [
            'controller' => 'Aquatin\Form\Http\Controller\IndexController',
            'action'     => 'clear'
        ],
        '*'    => [
            'controller' => 'Aquatin\Form\Http\Controller\IndexController',
            'action'     => 'error'
        ]
    ],
    'forms'    => [
        'Aquatin\Form\Http\Form\Upload' => include 'forms/upload.php'
    ]
];