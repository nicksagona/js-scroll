<?php

namespace Scroll\Model;

use Pop\Db\Parser\Predicate;
use Pop\Model\AbstractModel;
use Scroll\Table;

class User extends AbstractModel
{

    /**
     * Get all users
     *
     * @param  int    $page
     * @param  int    $limit
     * @param  string $sort
     * @param  mixed  $filter
     * @return array
     */
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
            $columns = Predicate::convertToArray($filter);
            return Table\Users::findBy($columns, [
                'offset' => $page,
                'limit'  => $limit,
                'order'  => $orderBy,
            ])->toArray();
        } else {
            return Table\Users::findAll([
                'offset' => $page,
                'limit'  => $limit,
                'order'  => $orderBy
            ])->toArray();
        }
    }

}
