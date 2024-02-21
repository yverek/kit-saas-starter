<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section>
  <article>
    <h2>Total of users registered <strong>({data.users[0].value})</strong></h2>
  </article>
  <article>
    <strong>{JSON.stringify(data.user, null, 2)}</strong>
    <form method="post" use:enhance>
      <button style="margin-top: 10px;">Sign out</button>
    </form>
  </article>
</section>