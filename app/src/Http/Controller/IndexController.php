<?php

namespace Scroll\Http\Controller;

use Scroll\Model;
use Pop\Csv\Csv;

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

        $userModel = new Model\User();
        $fields    = (null !== $this->request->getQuery('fields')) ? $this->request->getQuery('fields') : [];
        $page      = (null !== $this->request->getQuery('page')) ? (int)$this->request->getQuery('page') : null;
        $sort      = (null !== $this->request->getQuery('sort')) ? $this->request->getQuery('sort') : null;
        $filter    = (null !== $this->request->getQuery('filter')) ? $this->request->getQuery('filter') : null;
        $limit     = (null !== $this->request->getQuery('limit')) ?
            (int)$this->request->getQuery('limit') : $this->application->config['pagination'];

        $this->view->resultCount     = $userModel->getCount($filter);
        $this->view->results         = $userModel->getAll($page, $limit, $sort, $filter);
        $this->view->page            = (null !== $page) ? (int)$page : 1;
        $this->view->sort            = $sort;
        $this->view->filter          = (is_array($filter) && isset($filter[0])) ? $filter[0] : null;
        $this->view->limit           = $limit;
        $this->view->searched        = null;
        $this->view->searchedBy      = null;
        $this->view->searchFields    = $userModel->getSearchFields($fields);
        $this->view->allSearchFields = $userModel->getSearchFields();
        $this->view->fields          = $fields;
        $this->view->numbered        = (int)$this->application->config['numbered'];
        $this->view->noResults       = $this->application->config['no_results'];

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
        $userModel = new Model\User();
        $fields    = (null !== $this->request->getQuery('fields')) ? $this->request->getQuery('fields') : [];
        $page      = (null !== $this->request->getQuery('page')) ? (int)$this->request->getQuery('page') : null;
        $sort      = (null !== $this->request->getQuery('sort')) ? $this->request->getQuery('sort') : null;
        $filter    = (null !== $this->request->getQuery('filter')) ? $this->request->getQuery('filter') : null;
        $limit     = (null !== $this->request->getQuery('limit')) ?
            (int)$this->request->getQuery('limit') : $this->application->config['pagination'];

        $results = [
            'results'      => $userModel->getAll($page, $limit, $sort, $filter, $fields),
            'result_count' => $userModel->getCount($filter)
        ];

        $this->send(200, $results, 'OK', $this->application->config['http_options_headers']);
    }

    /**
     * Users count action
     *
     * @return void
     */
    public function usersCount()
    {
        $userModel = new Model\User();
        $filter    = (null !== $this->request->getQuery('filter')) ? $this->request->getQuery('filter') : null;
        $this->send(
            200, ['result_count' => $userModel->getCount($filter)], 'OK', $this->application->config['http_options_headers']
        );
    }

    /**
     * Export action
     *
     * @return void
     */
    public function export()
    {
        $userModel = new Model\User();
        $fields    = (null !== $this->request->getQuery('fields')) ? $this->request->getQuery('fields') : [];
        $sort      = (null !== $this->request->getQuery('sort')) ? $this->request->getQuery('sort') : null;
        $filter    = (null !== $this->request->getQuery('filter')) ? $this->request->getQuery('filter') : null;
        $results   = $userModel->getAll(null, null, $sort, $filter, $fields);

        Csv::outputDataToHttp($results);
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