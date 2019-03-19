<?php

namespace Scroll\Http\Controller;

use Scroll\Model;

class IndexController extends AbstractController
{

    /**
     * Index action
     *
     * @return void
     */
    public function index()
    {
        $this->prepareView('index.phtml');
        $this->view->title = 'Home';

        $this->send();
    }

    /**
     * Users action
     *
     * @return void
     */
    public function users()
    {
        $page    = (null !== $this->request->getQuery('page')) ? (int)$this->request->getQuery('page') : null;
        $limit   = (null !== $this->request->getQuery('limit'))  ? (int)$this->request->getQuery('limit') : null;
        $sort    = (null !== $this->request->getQuery('sort'))  ? $this->request->getQuery('sort') : null;
        $filter  = (null !== $this->request->getQuery('filter')) ? $this->request->getQuery('filter') : null;
        $users   = (new Model\User())->getAll($page, $limit, $sort, $filter);
        $this->send(200, ['users' => $users], 'OK', $this->application->config['http_options_headers']);
    }

    /**
     * Error action
     *
     * @return void
     */
    public function error()
    {
        $this->prepareView('error.phtml');
        $this->view->title = 'Error';
        $this->send(404);
    }

}