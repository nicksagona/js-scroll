<?php
namespace Scroll\Http\Event;

use Pop\Application;

class Options
{

    public static function check(Application $application)
    {
        if (($application->router()->hasController()) &&
            (null !== $application->router()->getController()->request()) &&
            ($application->router()->getController()->request()->isOptions()) &&
            method_exists($application->router()->getController(), 'sendOptions')) {
            $application->router()->getController()->sendOptions(200, 'OK', $application->config['http_options_headers']);
            exit();
        }
    }

}