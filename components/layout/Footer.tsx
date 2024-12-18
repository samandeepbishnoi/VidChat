"use client";
import React from "react";
import Container from "./Container";
import { Linkedin, Instagram, Github } from "lucide-react"; // Update social media icons

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white py-4 mt-auto">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mx-4">
          <div className="flex gap-4 items-center">
            <div className="font-bold text-lg">VidChat</div>
            <div className="text-sm">© {new Date().getFullYear()} VidChat</div>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/saman29/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href="https://github.com/samandeepbishnoi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href="https://www.instagram.com/sa.man_bishnoi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
