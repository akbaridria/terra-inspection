export const queryTotalTransactions = `
select
  date_trunc('day', block_timestamp::date) as date,
  count(*) as total
from
  terra.core.fact_transactions
group by
  1
order by
  1
`

export const queryActiveUsers = `
select
  date_trunc('day', block_timestamp::date) as date,
  count(distinct tx_sender) as total
from
  terra.core.fact_transactions
group by
  1
order by
  1
`

export const queryNetflowStaking = `
select
  block_timestamp::date as date,
  sum(
    case
      when action = 'Undelegate' then - amount
      else amount
    end
  ) as net_flow
from
  terra.core.ez_staking
group by
  1
order by
  1
`

export const queryNewWallets = `
select
  date_trunc('day', date::date) as date,
  count(*) as total
from
  (
    select
      tx_sender,
      min(block_timestamp::date) as date
    from
      terra.core.fact_transactions
    group by
      1
  ) ee where date >= '2022-06-01'
group by
  1
order by
  1
`

export const queryDiffNewWallet = (time, diff) =>  `
with
  data_new as (
    select
      date,
      count(*) as total
    from
      (
        select
          tx_sender,
          min(block_timestamp::date) as date
        from
          terra.core.fact_transactions
        group by
          1
      )
    group by
      1
    order by
      1
  )
select
  (
    (
      sum(
        case
          when date >= '${time}' then total
          else 0
        end
      ) - sum(
        case
          when date < '${time}' then total
          else 0
        end
      )
    ) / sum(
      case
        when date < '${time}' then total
        else 0
      end
    )
  ) * 100 as total
from
  data_new
where
  date >= dateadd(day, -${diff === 'week' ? 7 : 1}, '${time}')
  and date < dateadd(day, ${diff === 'week' ? 7 : 1}, '${time}')
`

export const queryDiffTransaction = (time, diff) => `
with
  data_new as (
    select
      block_timestamp::date as date,
      count(*) as total
    from
      terra.core.fact_transactions
    group by
      1
  )
select
  (
    (
      sum(
        case
          when date >= '${time}' then total
          else 0
        end
      ) - sum(
        case
          when date < '${time}' then total
          else 0
        end
      )
    ) / sum(
      case
        when date < '${time}' then total
        else 0
      end
    )
  ) * 100 as total
from
  data_new
where
  date >= dateadd(day, -${diff === 'week' ? 7 : 1}, '${time}')
  and date < dateadd(day, ${diff === 'week' ? 7 : 1}, '${time}')
`

export const queryActiveWallet = (time, diff) =>  `
with
  data_new as (
    select
      block_timestamp::date as date,
      count(distinct tx_sender) as total
    from
      terra.core.fact_transactions
    group by
      1
  )
select
  (
    (
      sum(
        case
          when date >= '${time}' then total
          else 0
        end
      ) - sum(
        case
          when date < '${time}' then total
          else 0
        end
      )
    ) / sum(
      case
        when date < '${time}' then total
        else 0
      end
    )
  ) * 100 as total
from
  data_new
where
  date >= dateadd(day, -${diff === 'week' ? 7 : 1}, '${time}')
  and date < dateadd(day, ${diff === 'week' ? 7 : 1}, '${time}')
`

export const queryDiffStaking = (time, diff) => `
with
  data_new as (
    select
      block_timestamp::date as date,
      sum(
        case
          when action = 'Undelegate' then - amount
          else amount
        end
      ) as total
    from
      terra.core.ez_staking
    group by
      1
  )
select
  (
    (
      sum(
        case
          when date >= '${time}' then total
          else 0
        end
      ) - sum(
        case
          when date < '${time}' then total
          else 0
        end
      )
    ) / sum(
      case
        when date < '${time}' then total
        else 0
      end
    )
  ) * 100 as total
from
  data_new
where
  date >= dateadd(day, -${diff === 'week' ? 7 : 1}, '${time}')
  and date < dateadd(day, ${diff === 'week' ? 7 : 1}, '${time}')
`