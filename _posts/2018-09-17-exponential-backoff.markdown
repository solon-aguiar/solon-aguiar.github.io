---
layout: post
title:  Exponential Back-off
date:   2018-09-17 20:36:00 -0300
categories: design-pattern backend
excerpt: The Exponential Back-off is pattern for retrying failed computations.
---

Following my post on [Circuit Breaker](https://solon-aguiar.github.io/design-pattern/backend/2018/09/06/circuit-breaker-pattern.html) I will now cover *Exponential Back-off*. This pattern can be used along with *Circuit Breaker*, but can also be used without it. In general, for any distributed system - especially one that operates at high scale, retrying failed remote requests with an exponential back-off is a good idea.

# The problem
Let's elaborate on the same **AccountSystem** example from the last post. As we saw, that system requests data from the **UserAccountsDB**, which is a hard dependency as without the data, the **AccountSystem** cannot do much computation.

Since we're working in a distributed system, we know that the remote request to the database can fail for a multitude of reasons: network blip, data loss, timeout while opening/re-establishing connection, process re-started, full request queue etc. To make our system more resilient and avoid throwing errors to our callers every time something happens we decide to retry a request every time it fails (we'll discuss the downside of this later). This will decrease our error response rate and make everyone happier.

# The solution 

To implement retries, we change of our main application logic to look something like this (pseudocode for a hypothetical 3 retries implementation):

```ruby
database = UserAccountsDB.new

3.times do
   data = database.read_user_data("user_id")
   break if data != Nil
end
```

We make the change, test and see that this code works. It retries each failed request up to three times. Great, we solved the problem... but created another. The problem with this approach is that it doesn't give time for whatever was causing the request to fail to be fixed - either by itself of via external interference. In other words, it doesn't "give" time for the system to recover. It simply keeps retrying until it succeeds or until it reaches the end of retries as we don't want to keep retrying forever.

What can we do to tackle this?

We can just wait a little bit! Let's add a little wait (let's say 200 ms) after each failure to give the system some time to recover from whatever is causing it to fail. Our code becomes this:

```ruby
database = UserAccountsDB.new

3.times do
   data = database.read_user_data("user_id")
   break if data != Nil
   system.sleep(200)
end
```

Now every time a request fails we wait a little bit (in this case I chose 200 ms arbitrarily) and then retry. The advantage of this is that, empirically - not mathematically, it is more likely that subsequent requests will succeed after a failure because we waited a little bit.

However, this implementation also has a problem. The problem is a little bit more subtle and normally only surfaces at large scale systems under very specific conditions (that aren't that rare as I'll tell you later in this post). 

## At scale

Let's imagine that our **AccountSystem** is running in production. Since we have a very successful company, we get a lot of traffic and have to scale it to 600 hosts to accommodate all the traffic. All of these hosts connect to the **UserAccountsDB** to read user data. Now let's imagine that for some unfortunate reason, the database goes down. What will happen to our **AccountSystem**? Since earlier we decided to make our system resilient via retries, it won't just start throwing errors at the callers. It will first retry failed requests. This is great until it isn't. 

All of our 600 hosts have received failures from the database when it went down, so all of these hosts have started to put their threads to sleep in order to retry those requests later. Until that point, nothing bad, everything working as we designed. But what happens when the **UserAccountsDB** comes back up? All of the "pending" requests (which can be a lot more than 600 assuming a system that handles more than one request at a time) will be retried in a very short span of time - possibly at the same time!

Since the failures started happening at around the same moment, the instances of the **AccountSystem** decided to "sleep" on those in hopes that they would be fixed. When the database came back up and the system "woke up", it started to retry everything that had been pending. Since the hosts most likely put the threads to sleep around the same time, all requests were retried simultaneously (or within a few seconds apart). This is potentially catastrophic for the database. 

Most of the time, the databases aren't scaled or ready to receive this massive load of requests (and for legitimate reasons!). Normally, databases don't have to match the scale of the systems that lives in front of them because they don't take all the load that those receive (obviously this assumption doesn't hold true in all the cases - it is a generalization of my part). Therefore, when all the requests are retried, the database can be overwhelmed and either perform really badly or even go down (often aggravating the problem itself). It can become a disastrous situation that requires a lot of manual work to be addressed as it keeps breaking itself.

The key problem here are the simultaneously retried requests. To address this issue, the *Exponential Backoff* comes into play. The idea is that each time a request fails, it "tells" us something about the environment. Basically, the more times the same request fails, the more we wait before the next retry, as previous errors indicate that something is not working well. Our pseudocode becomes something like this:

```ruby
database = UserAccountsDB.new

3.times do |i|
   data = database.read_user_data("user_id")
   break if data != Nil
   system.sleep(exponential_backoff(i))
end
```

The implementation of the `exponential_backoff` can vary on the application, but in general it can be something like this:

```ruby
def exponential_backoff(i)
  random.rand() * 2**i + 100
end
```

The idea is that we have a base value (in this case 100) and that we randomly wait a few extra milliseconds after each failure (hence the power operation). The random factor is used to avoid that all different requests retry at the same time (situation I described above). Different applications have different ways of implementing the back-off calculation itself (some deal with the base values differently, want to guarantee randomness etc.), but that is out of the scope of this post.

With this implementation, when the database starts failing and the requests go to sleep, they will be awaken at different times, which will avoid hammering the database with a big number of requests. Some requests can and will be retried simultaneously, but due to the randomness factor the number won't be as high as before. This will allow our system to gracefully come back up.

# The downside

Like everything in life, *Exponential Backoff* has a downside. A few of them are worth mentioning:

1. Each request that has a failure can take potentially longer to complete: the system might spend unnecessary time waiting before retrying a request. Let's look at an example: say that we started retry #2 for 3 seconds at t0. Imagine that the database came back at t1. Since we're waiting until t3, it won't be until that time that the system will be retry and succeeded on the pending request. As you can see, the system wasted 2 seconds.
1. The code gets more complex: Now every retry requires a calculation before it goes to sleep. Our code got a little bit more complex and can be hard to test if you don't inject the dependencies correctly.

It is a trade-off. Sometimes the resilience is worth it sometimes it isn't. It depends on your system.

# In practice
*Exponential Backoff* is a simple solution to a common problem in any computational system. However, you can't take its usage for granted. In my industry experience I've seen real big production issues in Fortune 500 companies that could have been avoided just by using a simple back-off strategy. Each of these failures cost a lot of money and reputation for these companies.

# Coming up
I'll continue on this series of patterns for system design. Next time I'll talk about using queues for buffering and processing.