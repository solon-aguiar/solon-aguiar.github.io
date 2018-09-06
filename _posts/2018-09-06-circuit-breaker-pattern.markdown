---
layout: post
title:  Circuit Breaker for higher availability and reliability
date:   2018-09-06 18:36:00 -0300
categories: design-pattern backend
excerpt: The Circuit Breaker pattern is a very useful pattern to improve reliability and availability of a back-end service or micro-service.
---

The *Circuit Breaker* pattern is a very useful pattern to improve reliability and availability of a back-end service or micro-service. The idea behind it is actually quite simple: if a system depends on another system (be this latter one a database, remote or distributed file system, back-end etc - any type of remote system that requires a connection), it can keep track of the state of that connection and take immediate action when that dependency is down or not functioning properly in order to alleviate resources.

An example will make it more clear. Let’s say that the **AccountSystem** makes requests to the **UserAccountsDB** in order to read all user data and respond with the user’s subscriptions. Clearly, the database is a requirement for the account system to work properly. If this database is not accessible then there’s not much the **AccountSystem** can do with every request. Therefore, it is a good design pattern for the **AccountSystem** to keep track of the state of that connection and make sure it only tries to fetch user data when it knows it can get the valuable information. In cases when it knows that the connection is not working, it can just reply an error to the caller. See the diagrams below:

![Connection Ok](/assets/images/cb_connection_ok.png)
![Connection Not Ok](/assets/images/cb_connection_not_ok.png)

This short circuited response allows the system as a whole to free up resources. If the **AccountSystem** still tried to fetch the user’s data, it would use more of its own and the caller's CPU time as well as network bandwidth. By not making the call it knows that can’t be fulfilled, it saves cpu clocks, bandwidth and time. A client of this service can quickly act on that error response however it deem necessary.

Another benefit of this approach is that whenever the database system does become available, then it won’t likely be overflowed with outstanding requests from the **AccountSystem**, thus reducing the availability risk.

While the idea behind the *Circuit Breaker* pattern is simple, it’s implementation can be a bit tricky (even though you can find some code on Wikipedia etc.). The thing is that maintaining the state of this connection (or many others in case your system depends on more than 1 remote system) is not trivial. You have to be careful with the transitions between those states. A few interesting questions to ask yourself:
When do you mark a connection as down? It is not a really good idea to do at every error as those can happen due to network and software glitches etc.
What is the time period to consider a connection down? X errors in Y seconds is enough? What are acceptable values of X and Y that will give the benefit of the short circuit and not cause too many false positives?
Once a connection is marked as down, how often do you check for its availability again, so that you can re-open the circuit? This is critical to be able to fully respond to requests again. When thinking about this one, it is specifically important to think how you keep retrying. A good alternative is using exponential backoffs, which will be the topic of my next post.

The *Circuit Breaker* pattern is very useful in the case of hard dependencies on other systems, but not the only case where it can be used. It can also be successfully applied in cases when the dependent system is not critical (such as a system that gives you updated weather forecasts in your exercise app). While up-to-date data is desired in all scenarios, some systems can tolerate stale data (even with a warning to the user) and continue to function properly. The *Circuit Breaker*, in this case, will help free up resources, as said before, and reduce request time.

Note that using the pattern will incur more complexity and possibly add some overhead to each (or some - depending on how often you check it) operations. It can also cause the whole system to take longer to “realize" the dependency is back (depending on how you check for the connection again).

As I said, using the *Circuit Breaker* improves reliability and availability. It does so because it makes your system more resilient to errors. In most cases the benefits outweigh the drawbacks and make it a good idea to use it.

While using a *Circuit Breaker*, it is generally a good idea to use an *Exponential Backoff* for testing the health of the dependent connections. Exponential Backoffs will be the topic of my next blog post. 

Stay tuned!