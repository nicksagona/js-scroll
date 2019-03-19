<?php

namespace Scroll\Model;

use Pop\Db\Parser\Predicate;
use Pop\Model\AbstractModel;
use Scroll\Table;

class User extends AbstractModel
{

    protected $searchFields = ['id', 'username', 'first_name', 'last_name', 'email'];

    public function getAll($page = null, $limit = null, $sort = null, $filter = null)
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
                'select' => $this->searchFields,
                'offset' => $page,
                'limit'  => $limit,
                'order'  => $orderBy,
            ])->toArray();
        } else {
            return Table\Users::findAll([
                'select' => $this->searchFields,
                'offset' => $page,
                'limit'  => $limit,
                'order'  => $orderBy
            ])->toArray();
        }
    }

    public function getCount($filter = null)
    {
        if (!empty($filter)) {
            return Table\Users::getTotal($this->getFilter($filter));
        } else {
            return Table\Users::getTotal();
        }
    }

    public function getSearchFields()
    {
        return $this->searchFields;
    }

    public function getFilter($filter)
    {
        return Predicate::convertToArray($filter);
    }

}
