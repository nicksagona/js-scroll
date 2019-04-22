<?php

namespace Scroll\Model;

use Pop\Db\Parser\Predicate;
use Pop\Model\AbstractModel;
use Scroll\Table;

class User extends AbstractModel
{

    /**
     * Search fields to select
     * @var array
     */
    protected $searchFields = ['id', 'username', 'first_name', 'last_name', 'email'];

    /**
     * Method to get all users
     *
     * @param  int    $page
     * @param  int    $limit
     * @param  string $sort
     * @param  mixed  $filter
     * @param  array  $filterFields
     * @return array
     */
    public function getAll($page = null, $limit = null, $sort = null, $filter = null, array $filterFields = [])
    {
        if ((null !== $limit) && (null !== $page)) {
            $page = ((int)$page > 1) ? ($page * $limit) - $limit : null;
        } else if (null !== $limit){
            $limit = (int)$limit;
        } else {
            $page  = null;
            $limit = null;
        }

        if (null !== $sort) {
            if (substr($sort, 0, 1) == '-') {
                $sort  = substr($sort, 1);
                $order = 'DESC';
            } else {
                $order = 'ASC';
            }
            $orderBy = $sort . ' ' . $order;
        } else {
            $orderBy = null;
        }

        if (!empty($filter)) {
            return Table\Users::findBy($this->getFilter($filter), [
                'select' => $this->getSearchFields($filterFields),
                'offset' => $page,
                'limit'  => $limit,
                'order'  => $orderBy,
            ])->toArray();
        } else {
            return Table\Users::findAll([
                'select' => $this->getSearchFields($filterFields),
                'offset' => $page,
                'limit'  => $limit,
                'order'  => $orderBy
            ])->toArray();
        }
    }

    /**
     * Method to get user count
     *
     * @param  mixed  $filter
     * @return int
     */
    public function getCount($filter = null)
    {
        if (!empty($filter)) {
            return Table\Users::getTotal($this->getFilter($filter));
        } else {
            return Table\Users::getTotal();
        }
    }

    /**
     * Method to get search fields
     *
     * @param  array $filterFields
     * @return array
     */
    public function getSearchFields(array $filterFields = [])
    {
        return (!empty($filterFields)) ?
            array_diff($this->searchFields, array_diff($this->searchFields, $filterFields)) : $this->searchFields;
    }

    /**
     * Method to get filter
     *
     * @param  mixed  $filter
     * @return array
     */
    public function getFilter($filter)
    {
        return Predicate::convertToArray($filter);
    }

}
