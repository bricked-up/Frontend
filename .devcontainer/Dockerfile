FROM mcr.microsoft.com/devcontainers/typescript-node
ARG USERNAME
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Example of installing programs
RUN apt-get update \
    && apt-get install -y \
    nano \
    vim \
    bash-completion \
    git \
    git-gui \
    gitk \
    meld \
    terminator \
    && rm -rf /var/lib/apt/lists/*

# Delete user if it exists in container (e.g Ubuntu Noble: ubuntu)
RUN if id -u $USER_UID ; then userdel `id -un $USER_UID` ; fi

# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
  && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && mkdir /home/$USERNAME/.config && chown $USER_UID:$USER_GID /home/$USERNAME/.config


# Set up sudo
RUN apt-get update \
  && apt-get install -y sudo \
  && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME\
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  && rm -rf /var/lib/apt/lists/*

USER $USERNAME

CMD ["/bin/bash"]
