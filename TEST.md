##Running The Tests

    npm test

You'll be asked for your `sudo` password, as the tests make a backup of your `/etc/hosts` file while it temporarily replaces it with the file `hosts`.
To be sure not to damage your system, the /etc/hosts is logged into .hosts.log within your current directory. You could edit, copy and paste the hosts back to /etc/hosts for repairing your system.
