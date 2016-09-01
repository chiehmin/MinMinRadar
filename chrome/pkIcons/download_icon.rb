#!/usr/bin/env ruby

(1..151).each do |id|
	padId = "%03d" % id
	%x[wget http://www.pkparaiso.com/imagenes/xy/sprites/pokemon/#{padId}.png]
end
