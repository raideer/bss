import { useState } from "preact/hooks";
import { urlArgs } from "util/url";
import { loadMemoItems } from ".";
import { Button } from "core/components/Button";

const ADD_ENDPOINT = '/w_inc/add_to_favorites.php?lg={{lang}}&m={{id}}&d={{date}}'
const DELETE_ENDPOINT = '/w_inc/add_to_favorites.php?lg={{lang}}&action=del&m={{id}}&d={{date}}'

interface Props {
  id: string;
  isInMemo: boolean;
}

function addToMemo (id: string, remove = false) {
  const endpoint = remove ? DELETE_ENDPOINT : ADD_ENDPOINT;

  return fetch(urlArgs(endpoint, { id, lang: 'lv', date: String(+new Date()) }), {
    headers: {
      accept: 'message/x-ajax'
    }
  })
}

export const MemoButton = ({ id, isInMemo }: Props) => {
  const [added, setAdded] = useState(isInMemo);

  const onClick = async (e: any) => {
    e.stopPropagation();

    if (id) {
      const memoIds = await loadMemoItems()
      const remove = memoIds.indexOf(id) !== -1
      addToMemo(id, remove)
      setAdded(!remove)

      const resultCount = remove ? memoIds.length - 1 : memoIds.length + 1

      const memoCountEl = document.querySelector('#mnu_fav_id')
      if (memoCountEl) {
        memoCountEl.textContent = ` (${resultCount})`
      }
    }
  }

  return (
    <Button onClick={onClick} variant={added ? 'accent' : 'default'}>
      <span>{ added ? '-' : '+'} Memo</span>
    </Button>
  )
}
