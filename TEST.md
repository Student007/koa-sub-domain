[![Build Status](https://travis-ci.org/Student007/koa-sub-domain.svg)](https://travis-ci.org/Student007/koa-sub-domain)
##Running The Tests
Edit: I have to change the test script to local because travis-ci doesn't accept `chmod +x` to the pre and post script! Travis-ci tests run by hosts within `.travis.yum` and your local should run well by 

    npm local

You'll be asked for your `sudo` password, as the tests make a backup of your `/etc/hosts` file while it temporarily replaces it with the file `hosts`.
To be sure not to damage your system, the /etc/hosts is logged into .hosts.log within your current directory. You could edit, copy and paste the hosts back to /etc/hosts for repairing your system.
