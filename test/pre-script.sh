#!/bin/bash
touch .hosts_log
sudo cat /etc/hosts >> .hosts_log
sudo cp /etc/hosts /etc/hosts_copy
sudo cp ./test/hosts /etc/hosts