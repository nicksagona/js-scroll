<?php

return [
    'file_upload' => [
        'type'       => 'file',
        'size'       => 40,
        'required'   => true,
        'attributes' => [
            'class'  => 'form-control-file',
            'size'   => 40
        ],
        'validators' => [
            new \Pop\Validator\RegEx('/^.*\.(pdf|jpg|jpeg|png)$/i', 'The file must either be a PDF, a JPG or a PNG.'),
            new \Pop\Validator\LessThanEqual('10000000', 'The file must be less than 10MB.')
        ]
    ],
    'submit' => [
        'type'       => 'submit',
        'value'      => 'Upload',
        'attributes' => [
            'class'  => 'btn btn-primary'
        ]
    ]
];