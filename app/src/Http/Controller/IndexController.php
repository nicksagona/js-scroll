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
        $this->view->title = 'Users';

        $page      = (null !== $this->request->getQuery('page')) ? (int)$this->request->getQuery('page') : null;
        $limit     = (null !== $this->request->getQuery('limit'))  ? (int)$this->request->getQuery('limit') : $this->application->config['pagination'];
        $sort      = (null !== $this->request->getQuery('sort'))  ? $this->request->getQuery('sort') : null;
        $filter    = (null !== $this->request->getQuery('filter')) ? $this->request->getQuery('filter') : null;
        $userModel = new Model\User();

        $this->view->userCount  = $userModel->getCount($filter);
        $this->view->users      = $userModel->getAll($page, $limit, $sort, $filter);
        $this->view->pagination = $this->application->config['pagination'];
        $this->view->searched   = null;
        $this->view->searchedBy = null;

        if (!empty($filter)) {
            $filterValues = $userModel->getFilter($filter);
            $this->view->searched   = array_values($filterValues)[0];
            $this->view->searchedBy = str_replace('%', '', array_keys($filterValues)[0]);
        }

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
     * Users count action
     *
     * @return void
     */
    public function usersCount()
    {
        $user   = new Model\User();
        $filter = (null !== $this->request->getQuery('filter')) ? $this->request->getQuery('filter') : null;
        $this->send(200, ['user_count' => $user->getCount($filter)], 'OK', $this->application->config['http_options_headers']);
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