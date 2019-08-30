%define _unpackaged_files_terminate_build 0
%define __jar_repack 0
Name: mypackage1
Version: 1.0
Release: SNAPSHOT20190830051251
Summary: mypackage1
License: Google 2019 1C1
Distribution: Trash 2019
Icon: icon.gif
Group: Application/Collectors
Packager: R1A2C
autoprov: yes
autoreq: yes
Prefix: /usr/local
BuildArch: noarch
BuildRoot: /root/Maven/jain_maven_jenkins/mypackage1/target/rpm/mypackage1/buildroot

%description
Jain Package

%install

if [ -d $RPM_BUILD_ROOT ];
then
  mv /root/Maven/jain_maven_jenkins/mypackage1/target/rpm/mypackage1/tmp-buildroot/* $RPM_BUILD_ROOT
else
  mv /root/Maven/jain_maven_jenkins/mypackage1/target/rpm/mypackage1/tmp-buildroot $RPM_BUILD_ROOT
fi

ln -s /usr/local/bin/new.sh $RPM_BUILD_ROOT/usr/local/bin/old.sh
ln -s /usr/local/bin $RPM_BUILD_ROOT/usr/local/oldbin

%files

%attr(440,rohit,rohit) "/usr/local/bin/landfill/Jenkins_maven_created"
%doc %attr(444,rohit,rohit) "/usr/local/doc/landfill"
%attr(750,rohit,rohit) "/usr/local/jain"
%attr(750,rohit,rohit)  "/usr/local/bin/old.sh"
%attr(750,rohit,rohit) "/usr/local/oldbin"
%config %attr(640,rohit,rohit) "/usr/local/conf/landfill"
%dir %attr(750,rohit,rohit) "/usr/local/log/landfill"

%pre
echo "installing mypackage1 now on `date`"

%post
echo "successfully installed"
netstat -nr

%preun
